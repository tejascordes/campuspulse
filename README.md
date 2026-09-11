# CampusPulse 🚀

**Thapar's social campus layer** — Reddit-style event feed, interactive campus map, and 3-tier privacy calendar.

> UCS503P Software Engineering Course Project

---

## 📁 Repository Structure

```
.
├── .github/workflows/                 # CI/CD Workflows
├── assets/                            # Design assets, screenshots, diagrams
├── code/                              # Application source code
│   ├── client/                        # Frontend client bundle
│   ├── server/                        # Python FastAPI backend
│   ├── src/                           # Core React frontend source
│   ├── public/                        # Static web assets
│   ├── index.html                     # Frontend entry point
│   ├── package.json                   # Client package configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   └── vite.config.js                 # Vite build configuration
├── docs/                              # Project documentation & MkDocs pages
├── journals/                          # Weekly lab progress & reflections
├── project-proposal/                  # Initial project proposal & requirements
├── project-report-prototype-stage/    # Prototype stage progress report
├── project-report-final/              # Final comprehensive project report
├── .gitignore                         # Git ignore rules
├── LICENSE                            # MIT License
├── Makefile                           # Development task runner
├── mkdocs.yml                         # MkDocs documentation site configuration
├── pyproject.toml                     # Python project configuration
└── README.md                          # Repository overview
```

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion + Leaflet
- **Backend**: Python FastAPI + SQLite / PostgreSQL + SQLAlchemy (async)
- **Design**: Dark Y2K Neon aesthetic

---

## 🚀 Quick Start

### 1. Backend (`code/server`)

```bash
cd code/server
pip install -r requirements.txt
uvicorn main:app --reload
# → API: http://localhost:8000
# → Swagger Docs: http://localhost:8000/docs
```

### 2. Frontend (`code`)

```bash
cd code
npm install
npm run dev
# → Web App: http://localhost:5173
```

---

## 📋 Features

| Feature | Description |
|---|---|
| 📰 **Feed** | Society events and friends' attending feed filtered by category |
| 🔖 **Saved Events** | Bookmark events with one click and synchronize with profile view |
| 🗺️ **Campus Map** | Full-screen Leaflet map with pulsing markers for campus locations |
| 📍 **Bottom Sheet** | Apple Maps-style drag-to-dismiss card with ratings, description, and directions |
| 👤 **Profile** | User stats, bookmarked events, and 3-tier calendar privacy settings |
| 🔐 **Auth** | JWT-based login/register with bcrypt password hashing |
