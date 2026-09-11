# Final Project Report — CampusPulse

## Executive Summary
CampusPulse is a comprehensive campus social platform designed for students at Thapar Institute of Engineering and Technology (TIET). The application delivers an engaging, intuitive hub for event discovery, social calendaring, and campus map exploration.

## Key System Components
1. **Frontend Architecture (`code/src`, `code/client`)**: Modular React 19 single-page application utilizing modern hooks, motion animation components, and responsive layouts.
2. **Backend Services (`code/server`)**: High-performance FastAPI server managing relational database interactions with async SQLAlchemy.
3. **Security & Privacy**: Standardized JWT tokens with bcrypt hashing and fine-grained 3-tier privacy (Public, Close Friends, Private).

## Testing & Verification
- Unit & API tests for FastAPI endpoints.
- Component and bundle validation for React frontend (`npm run build`).
