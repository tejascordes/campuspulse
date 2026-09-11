# Week 04 — Frontend Scaffolding & Leaflet Map Integration

**Date**: Week 4  
**Author**: CampusPulse Team  
**Focus**: React 19 Frontend, Leaflet Map, Geo-Coordinates  

---

## 1. Objectives
- Set up Vite build system with React 19 and Tailwind CSS.
- Map exact coordinates for Thapar University campus hotspots (Academic blocks, hostels, library, food street).
- Implement interactive map markers with dynamic color-coding.

## 2. Progress Summary
- Mapped 10+ campus landmarks with exact latitude and longitude coordinates.
- Configured Leaflet with CARTO Dark Matter vector tiles.
- Integrated marker click listeners to prepare for detail view drawers.

## 3. Challenges & Decisions
- **Challenge**: Leaflet default marker icons broke due to Vite path asset resolution.
- **Decision**: Created custom SVG `L.divIcon` markers with glowing CSS rings and category-specific icons.

## 4. Next Steps
- Develop FastAPI server with SQLAlchemy models and SQLite database.
