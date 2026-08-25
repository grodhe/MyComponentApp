# Hobbyist Inventory

A self-hosted inventory manager for electronics hobbyists — track components, generic stock items, storage locations, and projects, with barcode-style drawer labels, low-stock alerts, and a shopping list that's generated straight from a project's bill of materials.

Built as a React + Express + PostgreSQL app, designed to run in Docker (originally for a Synology NAS, but works anywhere Docker does — see [Running without a NAS](#running-without-a-nas)).

## Features

**Components & Generic Items** — Two kinds of stock: electronic *Components* (part number, manufacturer, package/footprint, datasheet link, value) for the parts you'd actually design with, and *Generic Items* for everything else (tools, hardware, consumables). Both support photos, minimum-quantity thresholds, and full CRUD.

**Locations** — A nested tree of storage locations (e.g. Cabinet → Drawer), rendered as an explorable tree alongside the components/items filed in each one. Locations always display their full path (`Cabinet A / Drawer 3`) so identically-named drawers in different cabinets are never ambiguous. Drawer labels can be printed with a QR code linking straight back to that location in the app.

**Projects** — Each project tracks its own parts list (a BOM merging both Components and Generic Items), documents, related repositories, and tasks. The parts list shows live availability against current stock and flags shortages.

**Shopping List** — Shortages on a project's parts list can be added to a shopping list in one click; the list also surfaces anything currently below its minimum quantity threshold.

**Dashboard** — At-a-glance view of low-stock items and active projects.

**Inventory Transactions** — Every stock adjustment (use/add) is logged with a timestamp, so you can see history for any component.

**Photos** — Upload a photo per component or generic item. Shown full-size on the Component Detail page and in the Generic Item edit dialog, and as small thumbnails in both list views, the Locations tree, and a project's parts list.

**CSV Import/Export** — Bulk import or export Components, Projects, and Generic Items as CSV, from a dedicated Utility page.

**Login (optional)** — Can authenticate against a Synology NAS's own DSM accounts (so you're not managing a separate password), or run with no login at all — see below.

## Tech stack

- **Frontend:** React 19, Vite, MUI (Material UI), react-router-dom v7
- **Backend:** Node.js, Express, PostgreSQL (via `pg`)
- **Auth:** JWT session cookies, optionally backed by Synology DSM login
- **File uploads:** Multer (component/item photos, stored on disk)

## Project structure

```
backend/
  src/
    config/        # env-driven app config
    controllers/    # request handlers
    services/       # business logic (CSV import/export, DSM auth, ...)
    repositories/    # SQL queries
    routes/         # Express routers
    middleware/      # auth guard, file upload
    schema.sql       # base database schema
frontend/
  src/
    pages/          # top-level routed pages
    components/      # dialogs, shared widgets, feature-specific UI
    services/        # API client functions
    context/         # React context (auth state)
```

## Getting started (Docker)

You'll need Docker, Docker Compose, and a PostgreSQL database (either as its own container or one you already run).

1. **Database.** Create a fresh database and run `backend/src/schema.sql` against it. If you're picking up later feature additions, also check for any `migrate_*.sql` files in `backend/` and run those in order — this project doesn't yet have a formal migration tool, so schema changes ship as plain SQL files alongside the code that needs them.

2. **Backend config.** Copy `backend/src/.env.example` to `backend/src/.env` and fill in your database connection details. See [Environment variables](#environment-variables) below for what each one does.

3. **Photo storage volume.** Component/item photos are written to disk, not the database, so they need a persistent volume or they're lost on every container rebuild:

   ```yaml
   services:
     backend:
       build: ./backend
       environment:
         - UPLOADS_DIR=/InventoryPhoto
       volumes:
         - ../uploads:/InventoryPhoto   # host path, outside the repo folder
       ports:
         - "3001:3001"

     frontend:
       build: ./frontend
       ports:
         - "8080:80"
       depends_on:
         - backend
   ```

   Adjust the host-side volume path, ports, and whether Postgres is its own service here or an external database, to match your actual setup.

4. **Frontend build-time config.** The frontend needs two Vite env vars *at build time* (baked into the compiled JS, so changing them means rebuilding, not just restarting):

   - `VITE_API_URL` — the backend's public API base URL, e.g. `https://your-domain.example/hobbyist/api`
   - `VITE_PUBLIC_APP_BASE_URL` — the app's own public base URL, used to build the links encoded in printed QR codes, e.g. `https://your-domain.example/hobbyist`

5. `docker compose up -d --build`.

## Running without a NAS

By default, login is required and checks against a Synology NAS's DSM accounts. If you don't have a Synology NAS — for example, running this from a plain GitHub checkout on your own machine — set one environment variable on the backend to skip login entirely:

```yaml
environment:
  - AUTH_ENABLED=false
```

(or in `backend/src/.env`). With this set, none of the `DSM_*` variables or `SESSION_SECRET` are needed — everyone gets straight into the app with no login screen at all. Leave it unset (or `true`) to keep DSM login required.

## Environment variables

**Backend** (`backend/src/.env`):

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default `3001`) | Port the backend listens on |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SCHEMA` | Yes | PostgreSQL connection details |
| `AUTH_ENABLED` | No (default `true`) | Set `false` to disable login entirely |
| `DSM_API_URL` | Only if `AUTH_ENABLED=true` | Base URL of your Synology DSM Web API, e.g. `https://192.168.1.50:5001` |
| `DSM_SESSION_NAME` | No (default `HobbyistApp`) | DSM session/app name, shown in DSM's Control Panel privileges |
| `DSM_VERIFY_SSL` | No (default `false`) | Verify DSM's TLS certificate (usually self-signed, so this stays off) |
| `DSM_ALLOWED_USERS` | Recommended if `AUTH_ENABLED=true` | Comma-separated DSM usernames allowed to log in; empty allows any valid DSM login |
| `SESSION_SECRET` | Only if `AUTH_ENABLED=true` | Secret used to sign login session tokens |
| `UPLOADS_DIR` | Recommended | Directory photos are written to; point this at a mounted volume or photos are lost on rebuild |

**Frontend** (build-time, via Vite):

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend's public API base URL |
| `VITE_PUBLIC_APP_BASE_URL` | No | App's public base URL, used for QR codes on printed labels |

## Development

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server expects the backend reachable at whatever `VITE_API_URL` points to — set that in a `frontend/.env` for local development (e.g. `VITE_API_URL=http://localhost:3001/api`).

## License

[MIT](https://github.com/orgs/community/discussions/LICENSE)