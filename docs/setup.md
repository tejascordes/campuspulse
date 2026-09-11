# Setup & Deployment Guide

## Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Python**: `3.10` or higher
- **pip**: Latest version

---

## 1. Local Development Setup

### Clone and Navigate
```bash
git clone https://github.com/tejascordes/campuspulse.git
cd campuspulse
```

### Install All Dependencies
Using the Makefile:
```bash
make install
```
Or manually:
```bash
# Frontend
cd code && npm install

# Backend
pip install -r code/server/requirements.txt
```

---

## 2. Running Services

### Start Backend API Server
```bash
make run-server
# Or directly:
cd code/server && uvicorn main:app --reload --port 8000
```
Backend API will be live at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

### Start Frontend Client
```bash
make run-client
# Or directly:
cd code && npm run dev
```
Client application will open at `http://localhost:5173`.

---

## 3. Documentation Site

To view the live MkDocs documentation:
```bash
make docs-serve
```
Access docs at `http://localhost:8000` (or `http://localhost:8001`).

To build static docs output for deployment:
```bash
make docs-build
```
Static HTML will be generated in `site/`.
