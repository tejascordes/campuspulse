from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from database import get_db
from models import CalendarEvent, User
from schemas import CalendarEventCreate, CalendarEventOut, CalendarPrivacy

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


@router.post("/add", response_model=CalendarEventOut)
async def add_event(
    data: CalendarEventCreate,
    user_id: int = 1,          # Simplified — real auth would inject current user
    db: AsyncSession = Depends(get_db)
):
    event = CalendarEvent(
        user_id=user_id,
        event_title=data.event_title,
        event_date=data.event_date,
        visibility=data.visibility,
        description=data.description,
    )
    db.add(event)
    await db.flush()
    await db.refresh(event)
    return CalendarEventOut.model_validate(event)


@router.get("/events", response_model=List[CalendarEventOut])
async def list_events(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CalendarEvent)
        .where(CalendarEvent.user_id == user_id)
        .order_by(CalendarEvent.event_date.asc())
    )
    events = result.scalars().all()
    return [CalendarEventOut.model_validate(e) for e in events]
