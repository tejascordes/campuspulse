# Week 05 — Backend Architecture & Database Integration

**Date**: Week 5  
**Author**: CampusPulse Team  
**Focus**: FastAPI REST Backend, SQLAlchemy Async ORM, Auth Flow  

---

## 1. Objectives
- Develop backend API endpoints for users, events, calendar RSVPs, friends, and map pins.
- Configure SQLite database with async SQLAlchemy 2.0.
- Implement JWT token generation and bcrypt password hashing.

## 2. Progress Summary
- Built routers: `auth.py`, `events.py`, `calendar.py`, `friends.py`, `map_pins.py`, `posts.py`.
- Formulated Pydantic schemas for request validation and response serialization.
- Seeded initial database with authentic Thapar campus landmarks, society announcements, and upcoming events.

## 3. Challenges & Decisions
- **Challenge**: Enabling both local demo mode and live API mode for seamless lab evaluation.
- **Decision**: Implemented an API client adapter in `src/api.js` with fallback to rich in-memory mock data if backend connection is unavailable.

## 4. Next Steps
- Implement draggable Apple Maps-style Bottom Sheet for map venue exploration.
