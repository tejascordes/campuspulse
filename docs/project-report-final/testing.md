# Testing & Quality Assurance Report

## 1. Testing Strategy

The verification strategy for CampusPulse integrates automated unit testing, integration tests, client production bundle profiling, and end-to-end user journey verification.

```
       /\
      /  \     E2E Manual User Journeys (Feed, Map, Drawer, Profile)
     /----\
    /      \   API Integration Tests (FastAPI TestClient / Pytest)
   /--------\
  /          \ Unit Tests (Schemas, Cryptography, Utils, Components)
 /------------\
```

---

## 2. Automated Test Suite

### 2.1 Backend Unit & Integration Tests (`code/server`)
- **Authentication Flow**: Validates user registration, duplicate email handling, bcrypt hashing, and JWT token issuance.
- **Event Filtering API**: Validates category queries (`tech`, `cultural`, `hackathon`) and search string matching.
- **3-Tier Privacy Enforcement**: Tests that Private RSVPs are excluded from public and friends' calendar feeds.

### 2.2 Test Cases Matrix

| Test ID | Module | Description | Expected Result | Status |
|---|---|---|---|---|
| **TC-01** | Auth | Register new user with valid email & roll number | HTTP 201 Created + User entity | PASS |
| **TC-02** | Auth | Login with invalid credentials | HTTP 401 Unauthorized | PASS |
| **TC-03** | Events | Query `/events?category=tech` | Returns only Tech events | PASS |
| **TC-04** | Map | Query `/map_pins` | Returns 10 campus pins with valid lat/long | PASS |
| **TC-05** | Calendar | RSVP to event with `privacy="private"` | RSVP stored; excluded from friend queries | PASS |
| **TC-06** | Frontend | Build production client bundle | Zero compilation/lint errors; chunks within budget | PASS |

---

## 3. Frontend Bundle & Performance Profiling

The production build was executed via `npm run build` using Rollup manual chunking optimization.

```
dist/index.html                             1.58 kB │ gzip:  0.61 kB
dist/assets/vendor-map-C1x187VB.css        14.89 kB │ gzip:  6.32 kB
dist/assets/index-D3lvNbbE.css             40.02 kB │ gzip:  8.31 kB
dist/assets/vendor-icons-DNE_J250.js       18.42 kB │ gzip:  7.05 kB
dist/assets/vendor-motion-CdSAglGO.js      32.76 kB │ gzip: 11.30 kB
dist/assets/vendor-utils-Cwt1K6go.js       49.95 kB │ gzip: 18.75 kB
dist/assets/index-zt49uwfo.js              73.96 kB │ gzip: 18.29 kB
dist/assets/vendor-map-ClICWv_Z.js        155.98 kB │ gzip: 45.78 kB
dist/assets/vendor-react-6Y8b0R3O.js      206.88 kB │ gzip: 64.81 kB
```

### Key Performance Results
- **Initial HTML Payload**: < 2 kB
- **Total Compressed CSS**: ~14.6 kB (gzipped)
- **Lazy/Modular Code Splitting**: Leaflet map bundle (`vendor-map`) and motion physics (`vendor-motion`) isolated from core UI bundle.
- **Build Time**: ~7.6 seconds
