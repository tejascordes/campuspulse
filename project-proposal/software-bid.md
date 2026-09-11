# Software Bid: CampusPulse

## 1. Project Identification
- **Project Title**: CampusPulse: Thapar's Social Campus Layer
- **Course**: UCS503P - Software Engineering Laboratory
- **Target Institution**: Thapar Institute of Engineering & Technology (TIET), Patiala
- **Target Audience**: Undergraduate & Postgraduate Students, Student Societies, Lab Coordinators

---

## 2. Business Case & Value Proposition

### 2.1 The Current Problem
1. **Information Fragmentation**: Campus events are broadcast across dozens of WhatsApp chats and ephemeral Instagram stories.
2. **Geographical Navigation Friction**: Freshmen and visiting students frequently struggle to locate specialized academic blocks (e.g., LP-Hall, C-Hall, TAN Lab, Library Audi).
3. **Social Coordination Deficit**: Students want to know which events their friends or society peers are attending without intrusive calendar invites.

### 2.2 Proposed Solution
CampusPulse resolves these pain points through three core pillars:
- **Centralized Event & Society Hub**: Filtered announcement board with categorization (Tech, Non-Tech, Hackathon, Refreshments, Cash Prizes).
- **Interactive Campus Map**: Geo-spatial visualization with interactive pin popups and sliding navigation drawers.
- **Granular Social Calendaring**: 3-Tier privacy settings (Public, Friends Only, Private) for synchronized attendance.

---

## 3. Scope of Work & Deliverables

| Phase | Milestone | Expected Deliverable | Status |
|---|---|---|---|
| **Phase 1** | Requirement Analysis & Proposal | Software Bid, Project Proposal, SRS, User Stories | Completed |
| **Phase 2** | UI/UX & High-Fidelity Prototype | Dark Y2K Neon UI, Leaflet Map Scaffolding, Feed View | Completed |
| **Phase 3** | Backend & Database Integration | FastAPI REST backend, SQLite/SQLAlchemy ORM, JWT Auth | Completed |
| **Phase 4** | Feature Refinement & Integration | Apple Maps Bottom Sheet, RSVP sync, 3-tier privacy | Completed |
| **Phase 5** | Verification & Deployment | Automated testing, Vite production build, MkDocs site | Completed |

---

## 4. Feasibility & Risk Analysis

| Risk Factor | Probability | Impact | Mitigation Strategy |
|---|---|---|---|
| Map Tile Latency | Medium | Medium | Use lightweight OpenStreetMap/CartoCDN tiles with client-side caching. |
| User Privacy Concerns | Medium | High | Enforce strict 3-tier privacy model at database query and API serialization level. |
| Inconsistent Event Schema | Low | Low | Enforce strict Pydantic schemas on FastAPI endpoints. |

---

## 5. Resource Requirements & Tech Stack
- **Client**: Node.js 20+, React 19, Tailwind CSS v4, Framer Motion, Leaflet.
- **Server**: Python 3.10+, FastAPI, SQLAlchemy 2.0 (Async), SQLite/aiosqlite.
- **Documentation**: MkDocs Material, Markdown, Mermaid.js.
