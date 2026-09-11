# System Architecture

## Architecture Overview

CampusPulse is engineered as a decoupled modern web application with high performance, visual richness, and strict privacy controls.

```mermaid
graph TB
    subgraph Client ["Client Layer (React 19 + Tailwind CSS)"]
        UI[User Interface & Dark Theme]
        Feed[Event Feed View]
        Map[Interactive Map & BottomSheet]
        Cal[3-Tier Calendar & Profile]
        APIClient[Axios API Adapter]
    end

    subgraph Server ["Server Layer (FastAPI REST)"]
        AuthRouter["Auth Router (JWT / Bcrypt)"]
        EventRouter["Events Router"]
        MapRouter["Map Pins Router"]
        CalRouter["Calendar & Friends Router"]
    end

    subgraph Data ["Persistence Layer"]
        ORM[SQLAlchemy Async Engine]
        DB[(SQLite / PostgreSQL)]
    end

    UI --> Feed
    UI --> Map
    UI --> Cal
    Feed --> APIClient
    Map --> APIClient
    Cal --> APIClient

    APIClient -->|JSON REST over HTTPS| Server
    AuthRouter --> ORM
    EventRouter --> ORM
    MapRouter --> ORM
    CalRouter --> ORM
    ORM --> DB
```

---

## Key Design Patterns
1. **Repository & Router Pattern**: Decouples API endpoints from database models.
2. **Adapter Pattern**: In `code/src/api.js`, dynamic fallbacks route requests to mock dataset when server is offline.
3. **Optimistic UI Updates**: State mutations reflect instantly in the interface before backend persistence completes.
4. **Role-Based Access Control (RBAC)**: Fine-grained permissions distinguishing regular students, society coordinators, and administrators.
