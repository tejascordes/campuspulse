import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, DateTime,
    ForeignKey, Enum as SAEnum, Boolean
)
from sqlalchemy.orm import relationship
from database import Base


class CalendarPrivacy(str, enum.Enum):
    NO_ONE = "NO_ONE"
    CLOSE_FRIENDS = "CLOSE_FRIENDS"
    EVERY_FRIEND = "EVERY_FRIEND"


class PostCategory(str, enum.Enum):
    ALL = "All"
    TECH = "Tech"
    NON_TECH = "Non-Tech"
    HACKATHONS = "Hackathons"
    PRIZES_ONLY = "Prizes Only"
    REFRESHMENTS = "Refreshments"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    default_calendar_privacy = Column(
        SAEnum(CalendarPrivacy), default=CalendarPrivacy.NO_ONE
    )
    avatar_url = Column(String(500), nullable=True)
    bio = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    calendar_events = relationship("CalendarEvent", back_populates="user", cascade="all, delete-orphan")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    society_name = Column(String(100), nullable=False)
    category = Column(SAEnum(PostCategory), default=PostCategory.TECH)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    upvotes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    post = relationship("Post", back_populates="comments")
    author = relationship("User", back_populates="comments")


class MapPin(Base):
    __tablename__ = "map_pins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    rating = Column(Float, default=4.0)
    distance_metric = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    icon_color = Column(String(20), default="#9D4EDD")


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_title = Column(String(200), nullable=False)
    event_date = Column(DateTime, nullable=False)
    visibility = Column(SAEnum(CalendarPrivacy), default=CalendarPrivacy.NO_ONE)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="calendar_events")


class Friendship(Base):
    __tablename__ = "friendships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    friend_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_close_friend = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Event(Base):
    """Structured campus event with registration support."""
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    society_name = Column(String(100), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    tagline = Column(String(200), nullable=True)
    venue = Column(String(200), nullable=True)
    event_date = Column(DateTime, nullable=False)
    event_end_date = Column(DateTime, nullable=True)
    max_capacity = Column(Integer, default=100)
    registered_count = Column(Integer, default=0)
    category = Column(SAEnum(PostCategory), default=PostCategory.TECH)
    # JSON string: [{"time": "10:00 AM", "activity": "Opening Ceremony"}, ...]
    itinerary_json = Column(Text, nullable=True)
    icon_color = Column(String(20), default="#9D4EDD")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    registrations = relationship("EventRegistration", back_populates="event", cascade="all, delete-orphan")
    invites = relationship("FriendInvite", back_populates="event", cascade="all, delete-orphan")


class EventRegistration(Base):
    """Tracks a user's registration for a structured event."""
    __tablename__ = "event_registrations"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String(200), nullable=True)  # for anonymous registrations
    registered_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="registrations")


class FriendInvite(Base):
    """Records an invitation sent from one user to another for an event."""
    __tablename__ = "friend_invites"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    inviter_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    invitee_email = Column(String(200), nullable=False)
    message = Column(String(300), nullable=True)
    sent_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="invites")


class Notification(Base):
    """In-app notification sent when a friend direct-shares an event or update."""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    title = Column(String(200), nullable=False)
    message = Column(String(300), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    recipient = relationship("User", foreign_keys=[user_id])
    sender = relationship("User", foreign_keys=[sender_id])
    event = relationship("Event")


