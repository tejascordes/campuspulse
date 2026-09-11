# Week 06 — Drawer Sheet & State Synchronization

**Date**: Week 6  
**Author**: CampusPulse Team  
**Focus**: Apple Maps-style Bottom Sheet, RSVP & Bookmark State Sync  

---

## 1. Objectives
- Create a swipeable / draggable bottom drawer component inspired by iOS Apple Maps.
- Synchronize bookmarked and RSVP'd events seamlessly between Feed view, Map view, and Profile view.
- Add toast notifications and modal dialogs for calendar saves.

## 2. Progress Summary
- Built `BottomSheet.jsx` supporting peek, half-expanded, and full-expanded states.
- Implemented `CalendarSaveModal.jsx` and `InviteModal.jsx` for friend invitations.
- Bound bookmark actions directly to user state so saving an event in the feed immediately updates the profile saved events list.

## 3. Challenges & Decisions
- **Challenge**: Smooth gesture dragging without lagging the underlying Leaflet map.
- **Decision**: Used CSS touch-action properties and hardware-accelerated transforms for zero-jank 60 FPS transitions.

## 4. Next Steps
- Conduct mid-semester prototype testing and verify SRS adherence.
