# Visitor Management System (VMS)

Monorepo structure:
- `client` - React + Tailwind frontend
- `server` - Node.js + Express + MongoDB backend
- `shared` - shared constants/types

## Quick Start

1. Install dependencies:
   - `npm install`
2. Create `server/.env` from `server/.env.example`
3. Run development mode:
   - `npm run dev`
4. Seed demo users + sample requests:
   - `npm run seed`

## Docker Setup

### Prerequisites
- Docker Desktop installed and running
- `server/.env` exists (copy from `server/.env.example` if needed)

### Run with Docker Compose
From the repository root:

1. Build and start all services:
   - `docker compose up --build`
2. Run in detached mode (optional):
   - `docker compose up --build -d`
3. View logs:
   - `docker compose logs -f`
4. Stop containers:
   - `docker compose down`

### Exposed services
- Frontend (Vite): `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Database configuration
- The backend reads `MONGO_URI` from `server/.env`.
- Use `server/.env.example` as the template and never commit `server/.env`.

## Roles
- Employee
- Manager
- Front-Desk
- IT Admin
