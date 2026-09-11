# Week 02 — Requirements & Feasibility Analysis

**Date**: Week 2  
**Author**: CampusPulse Team  
**Focus**: SRS Formulation, User Stories, Feasibility Analysis  

---

## 1. Objectives
- Detail Functional and Non-Functional Requirements.
- Construct initial Use-Case models and Data Flow Diagrams (DFDs).
- Produce the formal Software Bid document.

## 2. Progress Summary
- Created 15 distinct User Stories with clear acceptance criteria.
- Developed DFD Level 0 (Context) and DFD Level 1 diagrams for authentication, feed queries, and pin management.
- Evaluated open-source map providers: Mapbox GL vs. Leaflet OpenStreetMap. Leaflet was chosen for zero runtime cost and zero vendor lock-in.

## 3. Challenges & Decisions
- **Challenge**: Balancing user privacy when sharing calendar schedules.
- **Decision**: Architected a 3-tier privacy model (Public / Friends / Private) at the schema level from day one.

## 4. Next Steps
- Establish UI design tokens and layout wireframes in Tailwind CSS.
