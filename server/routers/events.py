import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, distinct, delete

from database import get_db
from models import Event, EventRegistration, FriendInvite, Post
from schemas import (
    EventOut,
    EventCreate,
    ItineraryItem,
    SocietyOut,
    FriendInviteCreate,
    FriendInviteOut,
)

router = APIRouter(prefix="/api", tags=["events_and_societies"])

# Static lookup for known society brand colors and taglines
SOCIETY_METADATA = {
    "CCS": {
        "color": "#9D4EDD",
        "tagline": "Creative Computing Society — Code. Create. Conquer.",
        "category": "Tech",
    },
    "Mudra": {
        "color": "#FF2D78",
        "tagline": "The Western Dance Society of Thapar — Rhythm in every beat.",
        "category": "Non-Tech",
    },
    "FAP": {
        "color": "#00F5FF",
        "tagline": "Fine Arts and Photography Society — Capturing campus perspectives.",
        "category": "Non-Tech",
    },
    "Trident": {
        "color": "#FF9500",
        "tagline": "Robotics & Automation Society — Engineering autonomous futures.",
        "category": "Tech",
    },
    "E-Cell": {
        "color": "#10B981",
        "tagline": "Entrepreneurship Development Cell — Fostering student founders.",
        "category": "Tech",
    },
    "Rotaract": {
        "color": "#EC4899",
        "tagline": "Youth wing of Rotary International — Leadership through service.",
        "category": "Non-Tech",
    },
    "Quiz Club": {
        "color": "#6366F1",
        "tagline": "The Quizzing Society — Trivia, tactics & intellect.",
        "category": "Non-Tech",
    },
    "Aagaaz": {
        "color": "#F59E0B",
        "tagline": "Street Play & Dramatics Society — Giving voice to social themes.",
        "category": "Non-Tech",
    },
}


def parse_itinerary(itinerary_json: Optional[str]) -> List[ItineraryItem]:
    if not itinerary_json:
        return []
    try:
        items = json.loads(itinerary_json)
        return [ItineraryItem(**item) for item in items]
    except Exception:
        return []


def format_event_out(event: Event, is_reg: bool = False) -> EventOut:
    return EventOut(
        id=event.id,
        society_name=event.society_name,
        title=event.title,
        description=event.description,
        tagline=event.tagline,
        venue=event.venue,
        event_date=event.event_date,
        event_end_date=event.event_end_date,
        max_capacity=event.max_capacity,
        registered_count=event.registered_count,
        category=event.category,
        icon_color=event.icon_color,
        is_active=event.is_active,
        created_at=event.created_at,
        itinerary=parse_itinerary(event.itinerary_json),
        is_registered=is_reg,
    )


# ── Event Endpoints ──────────────────────────────────────────────────────────

@router.get("/events", response_model=List[EventOut])
async def list_events(
    society_name: Optional[str] = None,
    category: Optional[str] = None,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    query = select(Event).where(Event.is_active == True).order_by(Event.event_date.asc())
    if society_name:
        query = query.where(Event.society_name == society_name)
    if category and category != "All":
        query = query.where(Event.category == category)

    result = await db.execute(query)
    events = result.scalars().all()

    # Find user registrations
    reg_result = await db.execute(
        select(EventRegistration.event_id).where(EventRegistration.user_id == user_id)
    )
    user_registered_ids = set(reg_result.scalars().all())

    return [format_event_out(e, e.id in user_registered_ids) for e in events]


@router.get("/events/{event_id}", response_model=EventOut)
async def get_event(
    event_id: int,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    reg_result = await db.execute(
        select(EventRegistration).where(
            EventRegistration.event_id == event_id,
            EventRegistration.user_id == user_id,
        )
    )
    is_registered = reg_result.scalar_one_or_none() is not None

    return format_event_out(event, is_registered)


@router.post("/events", response_model=EventOut)
async def create_event(
    data: EventCreate,
    db: AsyncSession = Depends(get_db),
):
    meta = SOCIETY_METADATA.get(data.society_name, {})
    event = Event(
        society_name=data.society_name,
        title=data.title,
        description=data.description,
        tagline=data.tagline or meta.get("tagline"),
        venue=data.venue,
        event_date=data.event_date,
        event_end_date=data.event_end_date,
        max_capacity=data.max_capacity,
        category=data.category,
        icon_color=data.icon_color or meta.get("color", "#9D4EDD"),
        itinerary_json=data.itinerary_json,
    )
    db.add(event)
    await db.flush()
    await db.refresh(event)
    return format_event_out(event, False)


@router.post("/events/{event_id}/register", response_model=EventOut)
async def register_for_event(
    event_id: int,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check already registered
    existing_reg = await db.execute(
        select(EventRegistration).where(
            EventRegistration.event_id == event_id,
            EventRegistration.user_id == user_id,
        )
    )
    if existing_reg.scalar_one_or_none():
        return format_event_out(event, True)

    if event.registered_count >= event.max_capacity:
        raise HTTPException(status_code=400, detail="Event capacity reached")

    # Add registration
    reg = EventRegistration(event_id=event_id, user_id=user_id)
    db.add(reg)
    event.registered_count += 1
    await db.flush()
    await db.refresh(event)

    return format_event_out(event, True)


@router.delete("/events/{event_id}/register", response_model=EventOut)
async def unregister_for_event(
    event_id: int,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    reg_result = await db.execute(
        select(EventRegistration).where(
            EventRegistration.event_id == event_id,
            EventRegistration.user_id == user_id,
        )
    )
    reg = reg_result.scalar_one_or_none()
    if reg:
        await db.delete(reg)
        if event.registered_count > 0:
            event.registered_count -= 1
        await db.flush()
        await db.refresh(event)

    return format_event_out(event, False)


@router.post("/events/{event_id}/invite", response_model=List[FriendInviteOut])
async def invite_friends(
    event_id: int,
    data: FriendInviteCreate,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    invites = []
    for email in data.emails:
        cleaned_email = email.strip()
        if cleaned_email:
            invite = FriendInvite(
                event_id=event_id,
                inviter_user_id=user_id,
                invitee_email=cleaned_email,
                message=data.message,
            )
            db.add(invite)
            invites.append(invite)

    await db.flush()
    for inv in invites:
        await db.refresh(inv)

    return [FriendInviteOut.model_validate(inv) for inv in invites]


# ── Society Endpoints ────────────────────────────────────────────────────────

@router.get("/societies", response_model=List[SocietyOut])
async def list_societies(db: AsyncSession = Depends(get_db)):
    # Gather distinct societies from Post and Event tables
    post_socs = (await db.execute(select(distinct(Post.society_name)))).scalars().all()
    event_socs = (await db.execute(select(distinct(Event.society_name)))).scalars().all()
    all_soc_names = set(post_socs) | set(event_socs) | set(SOCIETY_METADATA.keys())

    societies = []
    for name in sorted(all_soc_names):
        p_cnt = (
            await db.execute(select(func.count(Post.id)).where(Post.society_name == name))
        ).scalar() or 0
        e_cnt = (
            await db.execute(
                select(func.count(Event.id)).where(
                    Event.society_name == name, Event.is_active == True
                )
            )
        ).scalar() or 0

        meta = SOCIETY_METADATA.get(
            name,
            {"color": "#9D4EDD", "tagline": f"Official {name} Student Society", "category": "Tech"},
        )

        societies.append(
            SocietyOut(
                name=name,
                post_count=p_cnt,
                event_count=e_cnt,
                icon_color=meta["color"],
                tagline=meta["tagline"],
                category=meta.get("category", "Tech"),
            )
        )

    return societies


@router.get("/societies/{name}", response_model=SocietyOut)
async def get_society(name: str, db: AsyncSession = Depends(get_db)):
    p_cnt = (
        await db.execute(select(func.count(Post.id)).where(Post.society_name == name))
    ).scalar() or 0
    e_cnt = (
        await db.execute(
            select(func.count(Event.id)).where(
                Event.society_name == name, Event.is_active == True
            )
        )
    ).scalar() or 0

    meta = SOCIETY_METADATA.get(
        name,
        {"color": "#9D4EDD", "tagline": f"Official {name} Student Society", "category": "Tech"},
    )

    return SocietyOut(
        name=name,
        post_count=p_cnt,
        event_count=e_cnt,
        icon_color=meta["color"],
        tagline=meta["tagline"],
        category=meta.get("category", "Tech"),
    )
