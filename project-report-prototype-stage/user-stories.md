# User Stories & Acceptance Criteria

## Epic 1: Event Discovery & Society Engagement

### US-1.1: Categorized Event Feed
> **As a** student,  
> **I want to** filter campus events by category (Tech, Non-Tech, Hackathons, Free Food),  
> **So that** I can quickly find activities that match my interests.

**Acceptance Criteria:**
- Category pills (`All`, `Tech`, `Non-Tech`, `Hackathon`, `Free Food`, `Cash Prize`) are visible at the top of the feed.
- Selecting a pill instantly filters the feed without page reloading.
- Active pill displays glowing cyan/neon highlight.

---

### US-1.2: Event Bookmarking & RSVP
> **As a** student,  
> **I want to** bookmark interesting events with a single tap,  
> **So that** they appear in my profile and my personal calendar.

**Acceptance Criteria:**
- Bookmark icon toggles filled state immediately upon click.
- Bookmarked event is added to the user's `savedEvents` list in profile view.
- Success toast notification is displayed.

---

## Epic 2: Campus Map & Navigation

### US-2.1: Geo-Spatial Campus Exploration
> **As a** freshman student,  
> **I want to** browse an interactive map of Thapar University campus,  
> **So that** I can locate lecture halls, auditoriums, and hostels easily.

**Acceptance Criteria:**
- Map centers on Thapar University coordinates `[30.3533, 76.3686]`.
- Pulsing neon markers indicate campus hotspots.
- Map supports smooth pan and zoom gestures.

---

### US-2.2: Apple Maps-style Bottom Sheet
> **As a** student navigating to an event,  
> **I want to** tap a map marker to view building details and upcoming events in a drawer,  
> **So that** I have full context without navigating away from the map.

**Acceptance Criteria:**
- Tapping a pin opens a draggable bottom sheet with venue image, rating, description, and events.
- Drawer can be dragged between Peek, Half-Screen, and Full-Screen heights.
- Tapping 'Get Directions' provides walking guidance.

---

## Epic 3: Social Coordination & Privacy

### US-3.1: 3-Tier Privacy Control
> **As a** privacy-conscious student,  
> **I want to** configure my calendar privacy to Public, Friends Only, or Private,  
> **So that** I control who sees my schedule.

**Acceptance Criteria:**
- Radio buttons for `Public`, `Close Friends`, and `Private` are present in the Profile view.
- Modifying the selection updates user state and restricts visibility in friends' feeds accordingly.
