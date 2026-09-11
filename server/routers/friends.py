from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_

from database import get_db
from models import User, Friendship, Event, Notification, FriendInvite
from schemas import FriendOut, FriendAddRequest, DirectShareRequest, NotificationOut
from routers.auth import hash_password

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
        .order_by(Friendship.created_at.desc())
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


@router.post("/friends/add", response_model=FriendOut)
async def add_friend(
    data: FriendAddRequest,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    """Handles adding a new friend or connecting by user ID, email, or username."""
    target_user = None

    if data.friend_id:
        res = await db.execute(select(User).where(User.id == data.friend_id))
        target_user = res.scalar_one_or_none()

    if not target_user and data.email:
        res = await db.execute(select(User).where(User.email.ilike(data.email.strip())))
        target_user = res.scalar_one_or_none()

    if not target_user and data.username:
        search_str = data.username.strip()
        res = await db.execute(
            select(User).where(
                or_(
                    User.name.ilike(f"%{search_str}%"),
                    User.email.ilike(f"%{search_str}%"),
                )
            )
        )
        target_user = res.scalars().first()

    # If user doesn't exist yet, create a student user record dynamically
    if not target_user:
        raw_name = (data.username or (data.email.split("@")[0] if data.email else "Student")).strip()
        email_prefix = raw_name.lower().replace(" ", ".")
        new_email = data.email.strip() if data.email else f"{email_prefix}@thapar.edu"

        target_user = User(
            name=raw_name,
            email=new_email,
            hashed_password=hash_password("campus1234"),
            bio=f"COE '26 | {raw_name}",
        )
        db.add(target_user)
        await db.flush()
        await db.refresh(target_user)

    if target_user.id == user_id:
        raise HTTPException(status_code=400, detail="You cannot add yourself as a friend.")

    # Check if already friends
    existing_ship = await db.execute(
        select(Friendship).where(
            Friendship.user_id == user_id,
            Friendship.friend_id == target_user.id,
        )
    )
    ship = existing_ship.scalar_one_or_none()

    if not ship:
        ship = Friendship(
            user_id=user_id,
            friend_id=target_user.id,
            is_close_friend=data.is_close_friend,
        )
        db.add(ship)
        await db.commit()
    else:
        if data.is_close_friend != ship.is_close_friend:
            ship.is_close_friend = data.is_close_friend
            await db.commit()

    branch = "COE '26"
    if target_user.bio and "|" in target_user.bio:
        branch = target_user.bio.split("|")[0].strip()
    elif target_user.bio:
        branch = target_user.bio

    return FriendOut(
        id=target_user.id,
        name=target_user.name,
        email=target_user.email,
        avatar_url=target_user.avatar_url,
        bio=target_user.bio,
        is_close_friend=ship.is_close_friend,
        branch=branch,
    )


@router.delete("/friends/{friend_id}")
async def remove_friend(
    friend_id: int,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    """Removes a friend connection."""
    result = await db.execute(
        select(Friendship).where(
            Friendship.user_id == user_id,
            Friendship.friend_id == friend_id,
        )
    )
    ship = result.scalar_one_or_none()
    if ship:
        await db.delete(ship)
        await db.commit()
        return {"success": True, "message": "Friend removed successfully"}
    return {"success": True, "message": "Friendship not found or already removed"}


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
