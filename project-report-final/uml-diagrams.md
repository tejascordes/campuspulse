# UML Structural & Behavioral Diagrams

## 1. Class Diagram

```mermaid
classDiagram
    class User {
        +int id
        +string email
        +string username
        +string hashed_password
        +string full_name
        +string roll_number
        +string branch
        +int year
        +string avatar_url
        +string privacy_level
        +datetime created_at
        +authenticate(password) bool
        +update_privacy(level) void
    }

    class Event {
        +int id
        +string title
        +string description
        +string category
        +string society
        +string location_name
        +float latitude
        +float longitude
        +datetime start_time
        +datetime end_time
        +string poster_url
        +int created_by_id
        +get_rsvp_count() int
    }

    class MapPin {
        +int id
        +string title
        +string category
        +float latitude
        +float longitude
        +string description
        +string image_url
        +float rating
        +string building_code
    }

    class RSVP {
        +int id
        +int user_id
        +int event_id
        +string status
        +string privacy
        +datetime created_at
    }

    class Friendship {
        +int id
        +int user_id
        +int friend_id
        +string status
        +datetime created_at
    }

    User "1" --> "*" RSVP : creates
    Event "1" --> "*" RSVP : receives
    User "1" --> "*" Friendship : requests/accepts
    User "1" --> "*" Event : organizes
    MapPin "1" o-- "*" Event : hosts
```

---

## 2. Sequence Diagram: Event RSVP & Notification

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as React Client (EventCard)
    participant API as FastAPI Router (/calendar)
    participant DB as SQLite / SQLAlchemy
    participant Sync as State Sync Hook

    Student->>UI: Click 'Bookmark / RSVP'
    UI->>UI: Optimistic UI Update (fill bookmark icon)
    UI->>API: POST /calendar/rsvp {event_id: 42, privacy: "close_friends"}
    Note over UI,API: Bearer JWT Authorization Header
    API->>DB: Query User & Event existence
    DB-->>API: Entities found
    API->>DB: INSERT / UPDATE RSVP Record
    DB-->>API: Commit Success
    API-->>UI: HTTP 200 OK {status: "saved", rsvp_id: 108}
    UI->>Sync: Dispatch UPDATE_SAVED_EVENTS event
    Sync->>UI: Update Profile Badge & Feed State
    UI-->>Student: Display Toast ("Event saved to your calendar!")
```

---

## 3. Collaboration / Communication Diagram

```mermaid
graph LR
    U((Student)) -->|1: tapMapMarker()| C[MapView Component]
    C -->|2: selectPin(pinId)| S[State Controller]
    S -->|3: fetchPinDetails(pinId)| API[REST API Client]
    API -->|4: GET /api/map_pins/{id}| SVR[FastAPI Server]
    SVR -->|5: SELECT * FROM map_pins WHERE id=?| DB[(SQLite Database)]
    DB -.->|6: Pin Entity Data| SVR
    SVR -.->|7: JSON Response| API
    API -.->|8: Pin Payload| S
    S -->|9: setDrawerState('half')| D[BottomSheet Component]
    D -->|10: renderVenueCard()| U
```

---

## 4. State Chart Diagram: Event Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft : Society Lead Creates Draft
    Draft --> Published : Submit & Approve Event
    Published --> ActiveOngoing : Event Start Time Reached
    ActiveOngoing --> Completed : Event End Time Passed
    Completed --> Archived : 30 Days Retention Window
    Archived --> [*]

    Published --> Cancelled : Organizer Cancels Event
    ActiveOngoing --> Cancelled : Emergency Weather / Venue Notice
    Cancelled --> Archived : Retain Cancellation Record
```
