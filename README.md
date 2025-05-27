# PPT Monorepo

A modern, full-stack monorepo template for scalable web applications, featuring Next.js, Vite, Express, Prisma, shadcn/ui, and more. Built for rapid development, type safety, and best practices.

---

## Overview

This monorepo provides a robust foundation for building production-grade web applications with multiple frontends (Next.js, Vite), backend APIs (Express, Socket.io), a shared UI library (shadcn/ui), and a PostgreSQL database managed via Prisma. All code is organized for maximum reusability and maintainability.

---

## Tech Stack

- **Frontend:** Next.js (React, SSR), Vite (React, SPA)
- **Backend:** Express.js (REST API), Socket.io (WebSockets)
- **UI Library:** shadcn/ui (customizable React components)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (via Prisma ORM)
- **Type Safety:** TypeScript (everywhere)
- **Monorepo Tools:** pnpm workspaces, Turborepo
- **Linting/Formatting:** ESLint, Prettier
- **Other:** dotenv, helmet, morgan, cors, cookie-parser

---

## API Documentation

### Express API (apps/expressWeb)

#### `GET /`
- **Description:** Health check, returns JWT secret (for demo only; do not expose secrets in production).
- **Response:** `string` (JWT secret)

#### `POST /signup`
- **Description:** Register new users.
- **Request Body:**
  - `username` (string, required)
  - `password` (string, required)
  - `age` (number, required)
  - `email` (string, required)
- **Response:**
  - On success: Prisma createMany result (array of created users)
  - On validation error: Zod error format

#### `POST /signin`
- **Description:** User login (validates input, demo only).
- **Request Body:**
  - `username` (string, required)
  - `password` (string, required)
- **Response:**
  - On success: Zod validation result
  - On error: Zod error format

> All endpoints accept and return JSON. CORS is enabled and credentials are supported.

---

## Database Schema

Managed by Prisma (`packages/sqlDb/prisma/schema.prisma`).

### Models

#### User
- `id` (Int, PK, autoincrement)
- `username` (String, unique)
- `password` (String)
- `age` (Int)
- `email` (String)
- `todo` (Relation: Todo[])

#### Todo
- `id` (Int, PK, autoincrement)
- `title` (String)
- `description` (String)
- `isDone` (Boolean)
- `userId` (Int, FK to User)
- `user` (Relation: User)
- `time` (DateTime, default now())

**Relationships:**
- One User has many Todos. Each Todo belongs to one User.

---

## Features

- Modular monorepo: multiple apps, shared packages
- Full-stack type safety (TypeScript, Zod)
- Customizable UI library (shadcn/ui)
- REST API with validation
- PostgreSQL database with Prisma ORM
- Environment variable management with dotenv
- Secure HTTP headers (helmet), logging (morgan), CORS, cookies
- Ready for SSR, SPA, and real-time (Socket.io) apps

---

## Architecture

```
demo1/
├── apps/
│   ├── expressWeb/      # Express.js backend (API)
│   ├── socketWeb/       # Socket.io backend
│   ├── viteWeb/         # Vite + React frontend
│   └── web/             # Next.js frontend (SSR, shadcn/ui)
├── packages/
│   ├── backend-common/  # Shared backend logic/config
│   ├── common/          # Shared types, validation schemas
│   ├── eslint-config/   # Centralized ESLint config
│   ├── sqlDb/           # Prisma schema, DB client
│   ├── typescript-config/ # Shared tsconfig
│   └── ui/              # shadcn/ui component library
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```
- **Design:** Modular, clean code, separation of concerns, shared code via packages, type safety enforced everywhere.

---

## Best Practices

- **Environment Variables:** All secrets/configs via `.env` files (never commit to VCS)
- **Type Safety:** TypeScript and Zod for runtime and compile-time safety
- **Error Handling:** Centralized, consistent error responses
- **Logging:** HTTP request logging with morgan
- **Security:** Helmet for HTTP headers, CORS configured
- **Reusable Code:** Shared types, configs, and UI components
- **Prisma Singleton:** Prevents connection leaks in dev

---

## Setup Instructions

### 1. Installation
```bash
pnpm install
```

### 2. Environment Variables
- Copy `.env.example` to `.env` in each app/package that needs it (e.g., `apps/expressWeb/`, `packages/sqlDb/`).
- Set `DATABASE_URL` for Prisma, `PORT`, `JWT_SECRET`, etc.

### 3. Database Migration
```bash
pnpm --filter sqlDb prisma migrate dev
```

### 4. Running in Development
- **Next.js:**
  ```bash
  pnpm --filter web dev
  ```
- **Vite:**
  ```bash
  pnpm --filter viteWeb dev
  ```
- **Express:**
  ```bash
  pnpm --filter expressWeb dev
  ```
- **Socket.io:**
  ```bash
  pnpm --filter socketWeb dev
  ```

### 5. Running in Production
- Build all:
  ```bash
  pnpm build
  ```
- Start apps (example):
  ```bash
  pnpm --filter web start
  pnpm --filter expressWeb start
  # etc.
  ```

---

## Testing

- Add tests in each app/package as needed.
- Example (Jest, Vitest, or your preferred runner):
  ```bash
  pnpm test
  ```
- Lint all code:
  ```bash
  pnpm lint
  ```

---

## Deployment

- **Next.js:** Deploy to Vercel, Azure, or any Node.js host
- **Express:** Deploy to Azure App Service, Heroku, Render, etc.
- **Database:** Use managed PostgreSQL (e.g., Supabase, Azure, AWS RDS)
- **Environment:** Set all required env vars in your deployment platform

---


## Contact

Made with ❤️ by Arnab Saha  
- 🐦 Twitter: [@thearnabsaha](https://twitter.com/thearnabsaha)  
- 💻 GitHub: [@thearnabsaha](https://github.com/thearnabsaha)
