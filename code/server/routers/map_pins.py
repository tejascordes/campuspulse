from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from database import get_db
from models import MapPin
from schemas import MapPinOut

router = APIRouter(prefix="/api/map", tags=["map"])


@router.get("/pins", response_model=List[MapPinOut])
async def list_pins(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MapPin))
    pins = result.scalars().all()
    return [MapPinOut.model_validate(p) for p in pins]


@router.get("/pins/{pin_id}", response_model=MapPinOut)
async def get_pin(pin_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MapPin).where(MapPin.id == pin_id))
    pin = result.scalar_one_or_none()
    if not pin:
        raise HTTPException(status_code=404, detail="Pin not found")
    return MapPinOut.model_validate(pin)
