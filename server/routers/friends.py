from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_

from database import get_db
from models import User, Friendship, Event, Notification, FriendInvite
from schemas import FriendOut, DirectShareRequest, NotificationOut

router = APIRouter(prefix="/api", tags=["friends_and_sharing"])


@router.get("/friends", response_model=List[FriendOut])
async def list_friends(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    """Returns connected friends of the user, noting whether they are marked as Close Friends."""
    result = await db.execute(
        select(Friendship, User)
        .join(User, Friendship.friend_id == User.id)
        .where(Friendship.user_id == user_id)
    )
    rows = result.all()

    friends = []
    for friendship, friend_user in rows:
        # Extract campus branch or year from bio/email
        branch = "COE '26"
        if friend_user.bio and "|" in friend_user.bio:
            branch = friend_user.bio.split("|")[0].strip()
        elif friend_user.bio:
            branch = friend_user.bio

        friends.append(
            FriendOut(
                id=friend_user.id,
                name=friend_user.name,
                email=friend_user.email,
                avatar_url=friend_user.avatar_url,
                bio=friend_user.bio,
                is_close_friend=friendship.is_close_friend,
                branch=branch,
            )
        )

    return friends


@router.post("/events/{event_id}/direct-share")
async def direct_share_event(
    event_id: int,
    data: DirectShareRequest,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    """Direct-shares an event with selected friend IDs, instantly generating in-app notifications."""
    event_result = await db.execute(select(Event).where(Event.id == event_id))
    event = event_result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    sender_result = await db.execute(select(User).where(User.id == user_id))
    sender = sender_result.scalar_one_or_none()
    sender_name = sender.name if sender else "A classmate"

    sent_count = 0
    for friend_id in data.friend_ids:
        friend_res = await db.execute(select(User).where(User.id == friend_id))
        friend = friend_res.scalar_one_or_none()
        if not friend:
            continue

        custom_msg = data.message.strip() if data.message else f"{sender_name} shared an event with you: '{event.title}' by {event.society_name}."

        # Create in-app notification
        notif = Notification(
            user_id=friend_id,
            sender_id=user_id,
            event_id=event.id,
            title=f"📅 {event.title}",
            message=custom_msg,
            is_read=False,
            created_at=datetime.utcnow(),
        )
        db.add(notif)

        # Also register friend invite entry
        invite = FriendInvite(
            event_id=event.id,
            inviter_user_id=user_id,
            invitee_email=friend.email,
            message=custom_msg,
            sent_at=datetime.utcnow(),
        )
        db.add(invite)
        sent_count += 1

    await db.commit()

    return {
        "success": True,
        "event_id": event.id,
        "shared_count": sent_count,
        "message": f"Successfully sent in-app event invites to {sent_count} friends!",
    }


@router.get("/notifications", response_model=List[NotificationOut])
async def list_notifications(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    """Fetches in-app direct share notifications received by the current user."""
    result = await db.execute(
        select(Notification, User, Event)
        .outerjoin(User, Notification.sender_id == User.id)
        .outerjoin(Event, Notification.event_id == Event.id)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
    )
    rows = result.all()

    notifications = []
    for notif, sender, event in rows:
        notifications.append(
            NotificationOut(
                id=notif.id,
                user_id=notif.user_id,
                sender_id=notif.sender_id,
                sender_name=sender.name if sender else "CampusPulse",
                event_id=notif.event_id,
                event_title=event.title if event else None,
                title=notif.title,
                message=notif.message,
                is_read=notif.is_read,
                created_at=notif.created_at,
            )
        )

    return notifications


@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Marks an in-app notification as read."""
    result = await db.execute(
        select(Notification).where(Notification.id == notification_id)
    )
    notif = result.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    await db.commit()
    return {"success": True, "id": notification_id}
