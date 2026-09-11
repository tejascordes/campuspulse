# Technical Implementation Details

## 1. System Architecture

CampusPulse is developed as a modular client-server application adhering to Clean Architecture principles.

```
campus-pulse/
├── code/
│   ├── src/                    # Frontend React 19 application
│   │   ├── components/         # Reusable UI primitives (BottomSheet, Navbar, etc.)
│   │   ├── views/              # Page views (FeedView, MapView, ProfileView, LoginView)
│   │   ├── api.js              # Centralized Axios API client with offline fallback
│   │   ├── mockData.js         # Realistic demo seed data for lab demonstration
│   │   └── index.css           # Tailwind CSS theme & Dark Y2K neon utilities
│   ├── server/                 # Python FastAPI backend
│   │   ├── routers/            # Endpoint handlers (auth, events, map_pins, calendar)
│   │   ├── database.py         # SQLAlchemy async engine & session maker
│   │   ├── models.py           # Relational ORM models (User, Event, MapPin, RSVP)
│   │   ├── schemas.py          # Pydantic v2 validation models
│   │   └── main.py             # FastAPI application setup & CORS configuration
```

---

## 2. Frontend Engineering

### 2.1 React 19 & State Management
- Utilizes React 19 hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) for performant state updates without unnecessary re-renders.
- Synchronized event bookmarking across views with real-time optimistic UI updates.

### 2.2 Leaflet & Map Engine
- Customized Leaflet map view configured with Dark Matter CARTO tiles.
- Custom DOM marker icons (`L.divIcon`) with pulsing CSS animations for high visual distinction on dark map backgrounds.

### 2.3 Apple Maps-style Bottom Sheet
- Interactive swipeable sheet with Peek (120px), Half (50vh), and Full (85vh) snap heights.
- Smooth spring physics powered by Framer Motion.

---

## 3. Backend Engineering

### 3.1 FastAPI & Async SQLAlchemy
- High-throughput asynchronous request handling via `uvicorn` and `asyncio`.
- SQLite database handled via `aiosqlite` with foreign key integrity enabled.

### 3.2 Security & Authentication
- Password hashing using `passlib` with `bcrypt` (12 rounds).
- JWT (JSON Web Token) creation with HS256 algorithm and 7-day expiration time.
- OAuth2 Password Bearer flow with automatic token extraction and authentication dependency injection.

---

## 4. API Endpoints Specification

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new student account | No |
| `POST` | `/auth/login` | Authenticate and obtain JWT | No |
| `GET` | `/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/events` | List events with category & query filtering | Optional |
| `POST` | `/events` | Create new event (Society leads) | Yes |
| `GET` | `/map_pins` | Fetch campus location markers | No |
| `POST` | `/calendar/rsvp` | Bookmark / RSVP for an event | Yes |
| `GET` | `/calendar/saved` | Fetch student's bookmarked events | Yes |
