# CampusPulse 🚀

**Thapar's social campus layer** — Reddit-style event feed, interactive campus map, and 3-tier privacy calendar.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion + Leaflet
- **Backend**: Python FastAPI + SQLite + SQLAlchemy (async)
- **Design**: Dark Y2K Neon aesthetic

## Quick Start

### 1. Backend

```bash
cd campus-pulse/server
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### 2. Frontend

```bash
cd campus-pulse/client
npm install
npm run dev
# → http://localhost:5173
```

### Demo Login
- Email: `demo@thapar.edu`
- Password: `demo1234`

## Features

| Feature | Description |
|---------|-------------|
| 📰 **Feed** | Society events and friends' attending feed filtered by category |
| 🔖 **Saved Events** | Bookmark events with one click and synchronize with profile view |
| 🗺️ **Campus Map** | Full-screen Leaflet map with pulsing markers for campus locations |
| 📍 **Bottom Sheet** | Apple Maps-style drag-to-dismiss card with ratings, description, and Directions |
| 👤 **Profile** | User stats, Bookmarked events, and 3-tier calendar privacy settings |
| 🔐 **Auth** | JWT-based login/register with bcrypt password hashing |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/events` | List campus events (filter: `?category=Tech`) |
| POST | `/api/events/{id}/register` | Register/RSVP for event |
| POST | `/api/events/{id}/invite` | Send invite to friends |
| GET | `/api/map/pins` | All campus map pins |
| GET | `/api/map/pins/{id}` | Single pin details |
| POST | `/api/calendar/add` | Add calendar event |

## Deployment

- **Frontend** → Vercel (set root to `client/`, Vite auto-detected)
- **Backend** → Render/Railway (start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`)
- Set `VITE_API_URL` env var in Vercel to point to your deployed backend
