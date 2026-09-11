# API Reference & Endpoints

## Base URL
- **Local Backend**: `http://localhost:8000`
- **Interactive Swagger Documentation**: `http://localhost:8000/docs`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

---

## Authentication Endpoints

### `POST /auth/register`
Creates a new user profile.
- **Request Body**:
  ```json
  {
    "email": "student@thapar.edu",
    "password": "SecurePassword123!",
    "full_name": "Tejas Cordes",
    "roll_number": "102203001",
    "branch": "Computer Engineering",
    "year": 3
  }
  ```
- **Response**: `201 Created` with User object.

### `POST /auth/login`
Authenticates a user and returns a JWT Bearer token.
- **Request Body**: Form URL encoded `username` (email) and `password`.
- **Response**: `200 OK`
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "token_type": "bearer"
  }
  ```

---

## Event Endpoints

### `GET /events`
Retrieves campus events with optional filtering.
- **Query Parameters**:
  - `category` (string, optional): Filter by `tech`, `cultural`, `sports`, `hackathon`, `food`, `prizes`.
  - `query` (string, optional): Search across event titles, descriptions, and society names.
- **Response**: `200 OK` Array of Event objects.

---

## Campus Map Endpoints

### `GET /map_pins`
Retrieves geo-located campus markers for Thapar Institute.
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "title": "TAN Auditorium",
      "category": "Auditorium",
      "latitude": 30.3533,
      "longitude": 76.3686,
      "description": "Main air-conditioned auditorium hosting national conferences and society fests.",
      "rating": 4.8
    }
  ]
  ```
