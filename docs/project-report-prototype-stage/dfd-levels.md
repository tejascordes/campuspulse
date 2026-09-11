# Data Flow Diagrams (DFD Levels 0, 1, 2)

## 1. DFD Level 0 — Context Level Diagram

The Level 0 Context Diagram establishes the boundary between CampusPulse and external entities.

```mermaid
graph TD
    Student[Student / User]
    Society[Society Coordinator]
    Admin[Administrator]

    CP((0.0 CampusPulse System))

    Student -->|Credentials, RSVPs, Privacy Choice| CP
    CP -->|Event Feed, Map Pins, Friend Updates| Student

    Society -->|Event Posts, Venue Updates| CP
    CP -->|RSVP Statistics, Attendance Count| Society

    Admin -->|Campus Coordinates, Moderation| CP
    CP -->|System Health & Logs| Admin
```

---

## 2. DFD Level 1 — Subsystem Data Flow

Decomposition of CampusPulse into core functional sub-processes and data stores.

```mermaid
graph TD
    User[Student / User]

    P1((1.0 Authentication & User Profile))
    P2((2.0 Event & Announcement Feed))
    P3((3.0 Geo-Spatial Map Engine))
    P4((4.0 Social Calendar & Privacy Sync))

    D1[(D1: Users & Friends Store)]
    D2[(D2: Events & Posts Store)]
    D3[(D3: Map Pins & Venues Store)]
    D4[(D4: RSVPs & Saved Events Store)]

    User -->|Login / Register| P1
    P1 <-->|User Record / Tokens| D1

    User -->|Fetch & Filter Events| P2
    P2 <-->|Event Metadata & Categories| D2

    User -->|Select Location Pin| P3
    P3 <-->|Coordinates & Venue Details| D3

    User -->|Toggle Bookmark / Privacy| P4
    P4 <-->|RSVP & Privacy Tier| D4
    P4 <-->|Check Friendship Status| D1
```

---

## 3. DFD Level 2 — Event & RSVP Detailed Flow (Process 2.0 & 4.0)

```mermaid
graph TD
    User[Student]

    P2_1((2.1 Category Filtering))
    P2_2((2.2 Search Query Matcher))
    P4_1((4.1 RSVP Validator))
    P4_2((4.2 Privacy Tier Filter))

    D2[(D2: Events Store)]
    D1[(D1: Users Store)]
    D4[(D4: RSVPs Store)]

    User -->|Category Filter: 'Tech'| P2_1
    P2_1 -->|Query Tech Tags| D2
    D2 -->|Filtered Event List| P2_1
    P2_1 -->|Rendered Cards| User

    User -->|Click Bookmark / RSVP| P4_1
    P4_1 -->|Validate Token| D1
    P4_1 -->|Persist RSVP| D4
    D4 -->|Confirmation| P4_1
    P4_1 -->|Updated State| User

    User -->|View Friend Calendar| P4_2
    P4_2 -->|Check Mutual Friendship| D1
    P4_2 -->|Query Allowed RSVPs| D4
    D4 -->|Filtered Friend Events| P4_2
    P4_2 -->|Friend Feed| User
```
