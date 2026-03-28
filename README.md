# Monorepo Template

A full-stack monorepo with two frontends, a REST API, a WebSocket server, two databases, and a shared UI library -- all wired together and ready to run.

---

## What is this?

This is a **monorepo** -- a single repository that holds multiple apps and shared packages. Instead of having separate repos for your frontend, backend, and shared code, everything lives here in one place.

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

You need these installed on your machine before starting:

### 1. Node.js (v20 or higher)

Download from [https://nodejs.org](https://nodejs.org). Pick the **LTS** version. After installing, verify:

```bash
node --version
# Should print v20.x.x or higher
```

### 2. pnpm (package manager)

This project uses **pnpm** instead of npm. Install it globally:

```bash
npm install -g pnpm
```

Verify:

```bash
pnpm --version
```

### 3. Docker Desktop

The databases (PostgreSQL and MongoDB) run inside Docker containers so you don't need to install them directly.

Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop). After installing, make sure Docker is running (you should see the Docker icon in your system tray), then verify:

```bash
docker --version
docker compose version
```

---

## Step-by-Step Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/thearnabsaha/Fully-working-Turborepo-Template.git
cd Fully-working-Turborepo-Template
```

### Step 2: Install all dependencies

```bash
pnpm install
```

This installs dependencies for every app and package in the monorepo at once. It may take a minute the first time.

### Step 3: Set up environment variables

The repo includes `.env.demo` files with working default values. You need to copy them to `.env` files (which are gitignored and safe for local secrets). Run:

```bash
pnpm setup
```

You should see output like:

```
  copy  ./.env.demo -> ./.env
  copy  apps/expressWeb/.env.demo -> apps/expressWeb/.env
  copy  packages/backend-common/.env.demo -> packages/backend-common/.env
  copy  packages/sqlDb/.env.demo -> packages/sqlDb/.env
  copy  packages/nosqlDb/.env.demo -> packages/nosqlDb/.env

Done: 5 copied, 0 skipped (already existed).
```

The defaults work out of the box with the Docker databases. You don't need to edit anything for local development.

### Step 4: Start the databases

```bash
docker compose up -d
```

This downloads and starts two database containers in the background:

- **PostgreSQL** on port `5432`
- **MongoDB** on port `27017`

To check they are running:

```bash
docker compose ps
```

You should see both `postgres` and `mongo` with status `running`.

### Step 5: Run database migrations

The PostgreSQL database needs its tables created. Prisma handles this:

```bash
pnpm db:migrate
```

When prompted for a migration name, you can just press Enter or type something like `init`. This creates the `User` table in PostgreSQL based on the schema at `packages/sqlDb/prisma/schema.prisma`.

### Step 6: Start everything

```bash
pnpm dev
```

Turborepo will start all four apps in parallel. Wait for the output to settle, then open:

| App | URL |
|-----|-----|
| Next.js frontend | [http://localhost:3000](http://localhost:3000) |
| Vite frontend | [http://localhost:5173](http://localhost:5173) |
| Express API | [http://localhost:5001](http://localhost:5001) |
| WebSocket server | `ws://localhost:4002` |

You should see a page with a "Hello World" heading, an input field, and Light/Dark mode buttons on the Next.js app.

---

## Testing the API

The Express API has three endpoints. You can test them with `curl` or any API client (Postman, Insomnia, Thunder Client, etc.).

### Health check

```bash
curl http://localhost:5001/
```

Response:

```json
{ "status": "ok", "message": "Server is running" }
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

The password must be at least 8 characters with one uppercase, one lowercase, one number, and one special character (`@$!%*?&`). Age must be between 18 and 100.

On success you get:

```json
{ "id": 1, "username": "john", "email": "john@example.com" }
```

The user is saved to both PostgreSQL (via Prisma) and MongoDB (via Mongoose).

### Sign in

```bash
curl -X POST http://localhost:5001/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "Test@1234"
  }'
```

Response:

```json
{ "message": "Validation passed", "username": "john" }
```

---

## Testing the WebSocket Server

Open your browser's developer console (F12) and run:

```javascript
const ws = new WebSocket("ws://localhost:4002");
ws.onmessage = (e) => console.log("Received:", e.data);
ws.onopen = () => ws.send("Hello from browser!");
```

You should see:

```
Received: Connected to WebSocket server
Received: Hello from browser!
```

The server echoes back any message you send.

---

## Running Individual Apps

You don't have to start everything. Run just the app you need:

```bash
pnpm --filter web dev            # Next.js only (port 3000)
pnpm --filter viteweb dev        # Vite only (port 5173)
pnpm --filter expressweb dev     # Express API only (port 5001)
pnpm --filter socketweb dev      # WebSocket only (port 4002)
```

---

## Project Structure Explained

### How apps use shared packages

Both frontends (`web` and `viteWeb`) import components from the shared `packages/ui` package:

```tsx
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
```

The Express API imports validation schemas from `packages/common`, config from `packages/backend-common`, and database clients from `packages/sqlDb` and `packages/nosqlDb`:

```ts
import { SignUpSchema } from "@workspace/common/types"
import { JWT_SECRET } from "@workspace/backend-common/config"
import { prisma } from "@workspace/sqlDb/client"
import { User, connectDB } from "@workspace/nosqldb/client"
```

This means if you change a component in `packages/ui`, both frontends get the update automatically.

### How the databases work

**PostgreSQL** is managed by Prisma. The schema lives at `packages/sqlDb/prisma/schema.prisma`:

```prisma
model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
  age      Int
  email    String
}
```

To browse your PostgreSQL data visually:

```bash
pnpm db:studio
```

This opens Prisma Studio at [http://localhost:5555](http://localhost:5555).

**MongoDB** is managed by Mongoose. The model lives at `packages/nosqlDb/src/model/userModel.ts`. Both databases store the same User data (this is a template -- in a real app you would typically pick one).

### How environment variables work

Each package that needs config has its own `.env` file. The `.env.demo` files are committed to git so anyone cloning the repo can get started. The actual `.env` files are gitignored so secrets stay local.

| File | What it configures |
|------|--------------------|
| `.env` | Docker Compose database credentials |
| `apps/expressWeb/.env` | API port, CORS origin, Node environment |
| `packages/backend-common/.env` | JWT secret key |
| `packages/sqlDb/.env` | PostgreSQL connection string |
| `packages/nosqlDb/.env` | MongoDB connection string |

---

## Common Tasks

### Add a new shadcn/ui component

From the **project root**:

```bash
pnpm --filter @workspace/ui dlx shadcn@latest add dialog
```

Replace `dialog` with any [shadcn/ui component name](https://ui.shadcn.com/docs/components). The component gets added to `packages/ui/src/components/` and is immediately available to all apps.

### Change the database schema

1. Edit `packages/sqlDb/prisma/schema.prisma`
2. Run the migration:

```bash
pnpm db:migrate
```

3. The Prisma client is regenerated automatically. Your TypeScript types update too.

### Add a new shared package

1. Create a folder in `packages/` with a `package.json` (set the `name` field to `@workspace/your-package`)
2. It's automatically picked up by the pnpm workspace
3. Import it in any app with `@workspace/your-package`

### Build for production

```bash
pnpm build
```

This builds all apps. Next.js output goes to `apps/web/.next/`, Vite output to `apps/viteWeb/dist/`, and backend TypeScript compiles to `dist/` in each backend app.

---

## All Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm setup` | Copy `.env.demo` files to `.env` (safe to re-run, won't overwrite) |
| `pnpm dev` | Start all apps in development mode with hot reload |
| `pnpm build` | Build all apps and packages for production |
| `pnpm lint` | Run ESLint on all packages |
| `pnpm typecheck` | Type-check all packages with TypeScript |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check if files are formatted (no changes) |
| `pnpm db:migrate` | Create/apply Prisma database migrations |
| `pnpm db:generate` | Regenerate the Prisma client |
| `pnpm db:studio` | Open Prisma Studio to browse your data |

---

## Stopping Everything

Stop the dev servers with `Ctrl+C` in the terminal where `pnpm dev` is running.

Stop the databases:

```bash
docker compose down
```

To stop the databases **and delete all data** (start fresh):

```bash
docker compose down -v
```

---

## Troubleshooting

### `pnpm: command not found`

Install pnpm globally: `npm install -g pnpm`

### `docker: command not found`

Install Docker Desktop from [https://docker.com](https://docker.com) and make sure it's running.

### Port already in use

Another process is using the port. Find and kill it:

```bash
# On Windows (PowerShell)
netstat -ano | findstr :5001
taskkill /PID <pid> /F

# On macOS/Linux
lsof -i :5001
kill -9 <pid>
```

Or change the port in the relevant `.env` file.

### Database connection refused

Make sure Docker containers are running: `docker compose ps`. If not, start them: `docker compose up -d`. Wait a few seconds for the databases to be ready before running the app.

### Prisma migration fails

Make sure PostgreSQL is running and the `DATABASE_URL` in `packages/sqlDb/.env` matches the Docker Compose credentials in `.env`. The default values from `pnpm setup` are pre-matched, so if you changed one, change the other too.

### Fresh start

If things get messy, reset everything:

```bash
docker compose down -v          # Remove databases and data
pnpm setup                      # Re-copy .env.demo files
docker compose up -d            # Restart databases
pnpm db:migrate                 # Re-create tables
pnpm dev                        # Start apps
```
