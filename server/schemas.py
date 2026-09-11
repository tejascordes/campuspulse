from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from enum import Enum


# ── Enums ────────────────────────────────────────────────────────────────────

class CalendarPrivacy(str, Enum):
    NO_ONE = "NO_ONE"
    CLOSE_FRIENDS = "CLOSE_FRIENDS"
    EVERY_FRIEND = "EVERY_FRIEND"


class PostCategory(str, Enum):
    ALL = "All"
    TECH = "Tech"
    NON_TECH = "Non-Tech"
    HACKATHONS = "Hackathons"
    PRIZES_ONLY = "Prizes Only"
    REFRESHMENTS = "Refreshments"


# ── Auth Schemas ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    default_calendar_privacy: CalendarPrivacy
    created_at: datetime

    class Config:
        from_attributes = True


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Post Schemas ─────────────────────────────────────────────────────────────

class PostCreate(BaseModel):
    society_name: str
    category: PostCategory = PostCategory.TECH
    title: str
    description: str


class CommentCreate(BaseModel):
    body: str


class CommentOut(BaseModel):
    id: int
    body: str
    created_at: datetime
    user_id: Optional[int]
    author_name: Optional[str] = None

    class Config:
        from_attributes = True


class PostOut(BaseModel):
    id: int
    society_name: str
    category: PostCategory
    title: str
    description: str
    upvotes: int
    created_at: datetime
    user_id: Optional[int]
    author_name: Optional[str] = None
    comment_count: int = 0

    class Config:
        from_attributes = True


# ── Map Pin Schemas ───────────────────────────────────────────────────────────

class MapPinOut(BaseModel):
    id: int
    name: str
    category: str
    latitude: float
    longitude: float
    rating: float
    distance_metric: Optional[str]
    description: Optional[str]
    icon_color: str

    class Config:
        from_attributes = True


# ── Calendar Schemas ─────────────────────────────────────────────────────────

class CalendarEventCreate(BaseModel):
    event_title: str
    event_date: datetime
    visibility: CalendarPrivacy = CalendarPrivacy.NO_ONE
    description: Optional[str] = None


class CalendarEventOut(BaseModel):
    id: int
    user_id: int
    event_title: str
    event_date: datetime
    visibility: CalendarPrivacy
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Profile Update ────────────────────────────────────────────────────────────

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    default_calendar_privacy: Optional[CalendarPrivacy] = None


# ── Event & Society Schemas ──────────────────────────────────────────────────

class ItineraryItem(BaseModel):
    time: str
    activity: str


class EventBase(BaseModel):
    society_name: str
    title: str
    description: str
    tagline: Optional[str] = None
    venue: Optional[str] = None
    event_date: datetime
    event_end_date: Optional[datetime] = None
    max_capacity: int = 100
    category: PostCategory = PostCategory.TECH
    icon_color: str = "#9D4EDD"
    itinerary_json: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventOut(BaseModel):
    id: int
    society_name: str
    title: str
    description: str
    tagline: Optional[str] = None
    venue: Optional[str] = None
    event_date: datetime
    event_end_date: Optional[datetime] = None
    max_capacity: int
    registered_count: int
    category: PostCategory
    icon_color: str
    is_active: bool
    created_at: datetime
    itinerary: List[ItineraryItem] = []
    is_registered: bool = False

    class Config:
        from_attributes = True


class SocietyOut(BaseModel):
    name: str
    post_count: int = 0
    event_count: int = 0
    icon_color: str = "#9D4EDD"
    tagline: str = ""
    category: str = "Tech"


class FriendInviteCreate(BaseModel):
    emails: List[str]
    message: Optional[str] = None


class FriendInviteOut(BaseModel):
    id: int
    event_id: int
    invitee_email: str
    message: Optional[str]
    sent_at: datetime

    class Config:
        from_attributes = True


class FriendAddRequest(BaseModel):
    friend_id: Optional[int] = None
    username: Optional[str] = None
    email: Optional[str] = None
    is_close_friend: bool = False


class FriendOut(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    is_close_friend: bool = False
    branch: Optional[str] = None

    class Config:
        from_attributes = True


class DirectShareRequest(BaseModel):
    friend_ids: List[int]
    message: Optional[str] = None


class NotificationOut(BaseModel):
    id: int
    user_id: int
    sender_id: Optional[int] = None
    sender_name: Optional[str] = None
    event_id: Optional[int] = None
    event_title: Optional[str] = None
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


