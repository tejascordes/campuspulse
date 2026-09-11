# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for **CampusPulse**, a campus-wide social event discovery and navigation platform for students and societies at Thapar Institute of Engineering & Technology (TIET).

### 1.2 Scope
CampusPulse encompasses:
- Interactive event discovery with dynamic filtering.
- Geo-spatial interactive campus map with location pins and navigation cards.
- 3-tier privacy calendar coordination.
- Society announcement channels.

---

## 2. Overall Description

### 2.1 Product Perspective
CampusPulse is a standalone web application featuring a client-server architecture. The frontend is delivered as a Single Page Application (SPA) communicating over RESTful APIs with an asynchronous Python backend.

### 2.2 User Classes and Characteristics
1. **General Students**: Browse events, navigate campus buildings, bookmark events, and share schedules.
2. **Society Leads / Coordinators**: Post event updates, specify venue coordinates, and broadcast announcements.
3. **System Administrators**: Manage database seeds, moderate user posts, and maintain campus coordinates.

---

## 3. Specific Requirements

### 3.1 Functional Requirements (FR)

| Req ID | Title | Description | Priority |
|---|---|---|---|
| **FR-01** | User Authentication | System shall allow users to register and authenticate via JWT tokens. | High |
| **FR-02** | Event Filtering | System shall filter events by category (Tech, Non-Tech, Hackathon, Food, Prizes). | High |
| **FR-03** | Map Navigation | System shall display an interactive Leaflet map with geo-located campus markers. | High |
| **FR-04** | Bottom Sheet View | System shall open a slideable drawer displaying location details upon marker click. | High |
| **FR-05** | Event Bookmarking | System shall allow students to bookmark events and sync across profile and map views. | Medium |
| **FR-06** | 3-Tier Privacy Control | System shall enforce privacy levels (Public, Friends Only, Private) on user schedules. | High |
| **FR-07** | Society Story Reel | System shall render society stories/announcements in an interactive horizontal reel. | Medium |

### 3.2 Non-Functional Requirements (NFR)

- **NFR-01 (Performance)**: First Contentful Paint (FCP) shall be < 1.5s on 4G mobile networks.
- **NFR-02 (Security)**: Passwords must be hashed using bcrypt before database persistence.
- **NFR-03 (Usability)**: Interface must follow Dark Y2K Neon styling with accessible contrast ratios.
- **NFR-04 (Reliability)**: API endpoints shall maintain 99.9% uptime with offline mock data fallback.
