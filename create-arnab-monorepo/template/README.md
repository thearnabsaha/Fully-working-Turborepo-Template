# Monorepo Template

A full-stack monorepo with two frontends, a REST API, a WebSocket server, two databases, and a shared UI library -- all wired together and ready to run.

---

## What is this?

This is a **monorepo** -- a single repository that holds multiple apps and shared packages.

| Folder | What it is | Port |
|--------|-----------|------|
| `apps/web` | Next.js frontend (server-side rendered) | 3000 |
| `apps/viteWeb` | Vite + React frontend (single-page app) | 5173 |
| `apps/expressWeb` | Express.js REST API | 5001 |
| `apps/socketWeb` | WebSocket echo server | 4002 |

Shared code lives in `packages/`:

| Package | Purpose |
|---------|---------|
| `packages/ui` | Reusable React components (shadcn/ui, Button, Input, etc.) |
| `packages/common` | Shared TypeScript types and Zod validation schemas |
| `packages/backend-common` | Backend config (JWT secret, environment loading) |
| `packages/sqlDb` | PostgreSQL database client (Prisma ORM) |
| `packages/nosqlDb` | MongoDB database client (Mongoose) |
| `packages/eslint-config` | Shared ESLint rules for all packages |
| `packages/typescript-config` | Shared TypeScript settings for all packages |

---

## Prerequisites

You need these installed on your machine:

- **Node.js** v20 or higher -- [https://nodejs.org](https://nodejs.org)
- **pnpm** -- `npm install -g pnpm`
- **Docker Desktop** -- [https://docker.com](https://docker.com)

---

## Getting Started

The `.env` files are already included with working defaults. No extra setup needed.

### 1. Start the databases

```bash
docker compose up -d
```

This starts PostgreSQL (port 5432) and MongoDB (port 27017) in the background.

### 2. Run database migrations

```bash
pnpm db:migrate
```

This creates the `User` table in PostgreSQL.

### 3. Start all apps

```bash
pnpm dev
```

Then open:

| App | URL |
|-----|-----|
| Next.js frontend | [http://localhost:3000](http://localhost:3000) |
| Vite frontend | [http://localhost:5173](http://localhost:5173) |
| Express API | [http://localhost:5001](http://localhost:5001) |
| WebSocket server | `ws://localhost:4002` |

---

## Testing the API

### Health check

```bash
curl http://localhost:5001/
```

### Sign up a user

```bash
curl -X POST http://localhost:5001/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "age": 25,
    "password": "Test@1234"
  }'
```

### Sign in

```bash
curl -X POST http://localhost:5001/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "Test@1234"
  }'
```

---

## Running Individual Apps

```bash
pnpm --filter web dev            # Next.js (port 3000)
pnpm --filter viteweb dev        # Vite (port 5173)
pnpm --filter expressweb dev     # Express API (port 5001)
pnpm --filter socketweb dev      # WebSocket (port 4002)
```

---

## Environment Variables

The `.env` files ship with working defaults. Edit them to customize:

| File | What it configures |
|------|--------------------|
| `.env` | Docker Compose database credentials |
| `apps/expressWeb/.env` | API port, CORS origin, Node environment |
| `packages/backend-common/.env` | JWT secret key |
| `packages/sqlDb/.env` | PostgreSQL connection string |
| `packages/nosqlDb/.env` | MongoDB connection string |

---

## Common Tasks

### Add a shadcn/ui component

```bash
pnpm --filter @workspace/ui dlx shadcn@latest add dialog
```

### Change the database schema

1. Edit `packages/sqlDb/prisma/schema.prisma`
2. Run `pnpm db:migrate`

### Browse database

```bash
pnpm db:studio
```

### Build for production

```bash
pnpm build
```

---

## All Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Run ESLint on all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm db:migrate` | Create/apply Prisma migrations |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:studio` | Open Prisma Studio |

---

## Stopping Everything

```bash
# Stop dev servers
Ctrl+C

# Stop databases
docker compose down

# Stop databases and delete all data
docker compose down -v
```

---

## Troubleshooting

- **Port already in use** -- Change the port in the relevant `.env` file, or kill the process using it.
- **Database connection refused** -- Run `docker compose ps` to check if containers are running. Start them with `docker compose up -d`.
- **Fresh start** -- Run `docker compose down -v && pnpm db:migrate` to wipe and recreate the database.
