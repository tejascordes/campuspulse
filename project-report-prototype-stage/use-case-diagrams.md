# Use-Case Diagrams & Specifications

## 1. System Use-Case Diagram

```mermaid
graph LR
    Student((Student))
    SocietyLead((Society Lead))
    Admin((System Admin))

    subgraph CampusPulse Platform
        UC1([Authenticate / Login])
        UC2([Browse Event Feed])
        UC3([Filter by Category])
        UC4([Explore Campus Map])
        UC5([View Venue Bottom Sheet])
        UC6([Bookmark / RSVP Event])
        UC7([Configure 3-Tier Privacy])
        UC8([Post Event Announcement])
        UC9([Manage Campus Map Pins])
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7

    SocietyLead --> UC1
    SocietyLead --> UC8
    SocietyLead --> UC2

    Admin --> UC1
    Admin --> UC9
```

---

## 2. Detailed Use-Case Specifications

### Use-Case UC-05: View Venue Bottom Sheet
- **Primary Actor**: Student
- **Preconditions**: User has navigated to the Map View.
- **Trigger**: User clicks on a campus location marker (e.g. TAN Auditorium, Library).
- **Main Success Scenario**:
  1. System highlights the clicked marker with a pulsing cyan border.
  2. System animates the Apple Maps-style Bottom Sheet into half-expanded view.
  3. System renders venue photograph, aggregate student rating, description, and list of ongoing/upcoming events.
  4. User can swipe up to expand full details or swipe down to dismiss.
- **Postconditions**: Map view remains active in the background.

---

### Use-Case UC-07: Configure 3-Tier Calendar Privacy
- **Primary Actor**: Student
- **Preconditions**: Student is authenticated and viewing their Profile.
- **Trigger**: Student selects one of `Public`, `Close Friends`, or `Private`.
- **Main Success Scenario**:
  1. Student selects desired privacy level radio button.
  2. Frontend sends updated preferences to backend API (`PATCH /auth/me`).
  3. Backend updates `privacy_level` in SQLite database.
  4. System confirms with a success alert badge.
- **Postconditions**: Friends querying the student's schedule are filtered based on the new privacy tier.
