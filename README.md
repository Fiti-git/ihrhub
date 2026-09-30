# IhrHub

Freelance / job marketplace platform. Three deployable apps sharing one PostgreSQL database, in one monorepo.

## Repo layout

```
ihrhub/
├── README.md                    ← project map, quick start, known issues
├── LICENSE
├── .gitignore
├── .editorconfig
├── docker-compose.yml           ← dev — builds images from source
├── docker-compose.prod.yml      ← production — expects prebuilt images
├── .env.example                 ← copy to .env for docker-compose
│
├── apps/
│   ├── backend/                 ← Django 4.2 + DRF + Channels
│   ├── web/                     ← Next.js 15, React 19 — user site
│   └── admin/                   ← Next.js 15 + TypeScript + Tailwind — staff dashboard
│
└── docs/
    └── originals/               ← original setup docs (.docx / .pdf)
```

## The three apps

| App | Tech | Port | Purpose |
|---|---|---|---|
| [apps/backend](./apps/backend) | Django 4.2, DRF, PostgreSQL, JWT, Channels | 8000 | REST API + Jazzmin admin + WebSockets |
| [apps/web](./apps/web) | Next.js 15, React 19, Bootstrap 5 | 3000 | Public site — users, freelancers, employers |
| [apps/admin](./apps/admin) | Next.js 15, TypeScript, Tailwind 4 | 3001 | Staff dashboard |

### How they talk

```
   web :3000  ─┐
              ├──> backend :8000  ─→  Postgres :5432
 admin :3001  ─┘
```

Both frontends read the backend URL from env (`NEXT_PUBLIC_API_URL` for `web`, `NEXT_PUBLIC_API_BASE_URL` for `admin`).

### Backend Django apps

`myapi` (auth, roles), `profiles` (freelancers, employers), `jobs`, `project` (proposals, milestones), `chat` (WebSockets), `support` (tickets), `cms` (services), `choices_manager`, `cadmin` (admin dashboard backend).

API docs live at `http://127.0.0.1:8000/swagger/` when running.

## Quick start (recommended: Docker)

```bash
cp .env.example .env          # edit DB creds if you want
docker compose up --build
```

Then:
- Web:     http://localhost:3000
- Admin:   http://localhost:3001
- API:     http://localhost:8000
- Swagger: http://localhost:8000/swagger/

## Quick start (bare metal)

Requires: Python 3.11+, Node 20+, PostgreSQL 14+ running locally.

### Backend
```bash
cd apps/backend
python -m venv .venv
.venv\Scripts\activate           # Windows
pip install -r requirements.txt
cp .env.example .env             # edit DB creds
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Web
```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

### Admin
```bash
cd apps/admin
npm install
cp .env.example .env.local
npm run dev -- -p 3001
```

## Production deployment

Because the target server is CPU-sensitive, we **never build on production**. Pattern:

1. Build images locally: `docker compose -f docker-compose.prod.yml build`
2. Save to tarball: `docker save ihrhub-backend:prod ihrhub-web:prod ihrhub-admin:prod | gzip > /tmp/ihrhub.tar.gz`
3. Ship: `scp /tmp/ihrhub.tar.gz user@server:/path/to/ihrhub/`
4. Load on server: `gunzip -c /path/to/ihrhub/ihrhub.tar.gz | docker load`
5. Start: `docker compose -f docker-compose.prod.yml up -d`

Server CPU stays near zero — it just extracts and runs.

## Environment variables

Each app has its own `.env.example`. Top-level `.env.example` covers the compose orchestration.

**Secrets** (`SECRET_KEY`, `DB_PASSWORD`, API tokens) must be generated per environment. Never commit `.env`.

## Known rough edges

- **Google OAuth client ID hardcoded** in [apps/web/src/app/layout.js](./apps/web/src/app/layout.js) — should read from env.
- **CHANNEL_LAYERS uses `InMemoryChannelLayer`** — swap to Redis for multi-worker production.
- **~143 TypeScript errors in admin** — currently bypassed via `typescript.ignoreBuildErrors` in next.config.ts. Chip away over time.
- **`DEFAULT_PERMISSION_CLASSES = AllowAny`** on DRF — every endpoint is public unless explicitly locked. Should flip to `IsAuthenticated` and audit endpoints.
- **The two frontends use different env var names** for the API URL (`NEXT_PUBLIC_API_URL` vs `NEXT_PUBLIC_API_BASE_URL`). Unify when convenient.

## Docs

[docs/originals/](./docs/originals/) holds the original developer setup .docx and .pdf files. Convert to Markdown as time permits.

## Related repos (archived)

This monorepo replaces three earlier repos:
- `Fiti-git/FI-IHR-B` — original backend
- `Fiti-git/FI-IHR-F-next` — original user frontend
- `Fiti-git/ihrhub-admin` — original admin dashboard

Those repos remain on GitHub for history reference. All new work happens here.
