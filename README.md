# CampusPulse 🚀

**Thapar's Social Campus Layer** — Reddit-style event feed, interactive campus map, and 3-tier privacy calendar.

> **Course**: UCS503P Software Engineering Course Project  
> **Documentation**: Complete MkDocs documentation available in [`docs/`](docs/) or via `make docs-serve`.

---

## 📁 Repository Structure

```
.
├── .github/workflows/                 # CI/CD Workflows (GitHub Actions)
├── assets/                            # Design assets, screenshots, diagrams
├── code/                              # Application source code
│   ├── src/                           # Core React frontend source
│   ├── public/                        # Static web assets
│   ├── server/                        # Python FastAPI backend
│   ├── index.html                     # Frontend entry point
│   ├── package.json                   # Frontend dependencies & scripts
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   └── vite.config.js                 # Vite build configuration
├── docs/                              # Project documentation & MkDocs source pages
│   ├── index.md                       # Documentation homepage
│   ├── architecture.md                # System architecture documentation
│   ├── api.md                         # API reference & contracts
│   └── setup.md                       # Setup & deployment guide
├── journals/                          # Weekly lab progress logs (Week 01 to 08)
├── project-proposal/                  # Initial project proposal & software bid
├── project-report-prototype-stage/    # Mid-sem report (SRS, User Stories, DFD, Use-Case)
├── project-report-final/              # End-sem report (UML, Implementation, Testing)
├── .gitignore                         # Git ignore rules
├── LICENSE                            # MIT License
├── Makefile                           # Development task runner (install, dev, build, docs)
├── mkdocs.yml                         # MkDocs documentation site configuration
├── pyproject.toml                     # Python project configuration
└── README.md                          # Repository overview
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + Framer Motion + Leaflet
- **Backend**: Python FastAPI + SQLite / PostgreSQL + SQLAlchemy (async)
- **Styling**: Dark Y2K Neon aesthetic (`#07070b` theme with neon cyan & purple accents)
- **Documentation**: MkDocs Material with Mermaid diagram support

---

## 🚀 Quick Start

### Using Makefile

```bash
# Install all dependencies (Node + Python + MkDocs)
make install

# Build client bundle
make build

# Launch documentation site
make docs-serve
```

### Manual Service Start

#### 1. Backend API (`code/server`)
```bash
cd code/server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → API: http://localhost:8000
# → Swagger Docs: http://localhost:8000/docs
```

#### 2. Frontend Client (`code`)
```bash
cd code
npm install
npm run dev
# → Web App: http://localhost:5173
```

#### 3. Documentation Site (`docs`)
```bash
mkdocs serve
# → Documentation: http://localhost:8000
```

---

## 📋 Academic SE Deliverables

| Stage / Document | Location | Description |
|---|---|---|
| **Software Bid** | [`project-proposal/software-bid.md`](project-proposal/software-bid.md) | Business justification, scope, feasibility, and risk analysis |
| **Project Overview** | [`project-proposal/project-overview.md`](project-proposal/project-overview.md) | High-level system vision, modules, and architecture |
| **Progress Journals** | [`journals/`](journals/) | Weekly progress reflections (Weeks 01–08) |
| **SRS Specification** | [`project-report-prototype-stage/srs.md`](project-report-prototype-stage/srs.md) | Functional & non-functional requirements (IEEE 830 format) |
| **User Stories** | [`project-report-prototype-stage/user-stories.md`](project-report-prototype-stage/user-stories.md) | Agile user stories with acceptance criteria |
| **Use-Case Diagrams** | [`project-report-prototype-stage/use-case-diagrams.md`](project-report-prototype-stage/use-case-diagrams.md) | System use-case diagrams with detailed actor interactions |
| **Data Flow Diagrams** | [`project-report-prototype-stage/dfd-levels.md`](project-report-prototype-stage/dfd-levels.md) | DFD Level 0 (Context), Level 1, and Level 2 decompositions |
| **UML Models** | [`project-report-final/uml-diagrams.md`](project-report-final/uml-diagrams.md) | Class, Sequence, Collaboration, and State Chart diagrams |
| **Implementation** | [`project-report-final/implementation.md`](project-report-final/implementation.md) | Complete codebase architecture, state flow, and database models |
| **Testing & QA** | [`project-report-final/testing.md`](project-report-final/testing.md) | Test plan, test cases matrix, and bundle performance metrics |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
