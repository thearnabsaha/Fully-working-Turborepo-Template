# Monorepo: shadcn/ui Template with Multiple Apps

This monorepo is structured to support scalable development with multiple web applications and shared packages, leveraging the [shadcn/ui](https://ui.shadcn.com/) component system, [pnpm workspaces](https://pnpm.io/workspaces), and [Turborepo](https://turbo.build/).

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Apps Overview](#apps-overview)
- [Packages Overview](#packages-overview)
- [UI Components (shadcn/ui)](#ui-components-shadcnui)
- [Development](#development)
- [Adding Components](#adding-components)
- [Using Shared Packages](#using-shared-packages)
- [Linting & Formatting](#linting--formatting)
- [TypeScript Configuration](#typescript-configuration)
- [Monorepo Management](#monorepo-management)
- [Scripts & Tooling](#scripts--tooling)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
demo1/
├── apps/
│   ├── expressWeb/      # Express.js backend app (TypeScript)
│   ├── socketWeb/       # Socket.io backend app (TypeScript)
│   ├── viteWeb/         # Vite + React frontend app
│   └── web/             # Next.js frontend app (shadcn/ui integrated)
├── packages/
│   ├── backend-common/  # Shared backend utilities/types
│   ├── common/          # Shared types/utilities for all apps
│   ├── eslint-config/   # Centralized ESLint config
│   ├── typescript-config/ # Centralized TypeScript config
│   └── ui/              # shadcn/ui component library (shared)
├── package.json         # Monorepo root config
├── pnpm-workspace.yaml  # pnpm workspace definition
├── turbo.json           # Turborepo pipeline config
├── tsconfig.json        # Root TypeScript config
└── README.md            # This file
```

---

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build all packages and apps:**
   ```bash
   pnpm build
   ```

3. **Run development servers:**
   - For Next.js app:
     ```bash
     pnpm --filter web dev
     ```
   - For Vite app:
     ```bash
     pnpm --filter viteWeb dev
     ```
   - For Express/Socket apps:
     ```bash
     pnpm --filter expressWeb dev
     pnpm --filter socketWeb dev
     ```

---

## Apps Overview

- **apps/web**: Next.js app, main consumer of the `@workspace/ui` package. Supports SSR, API routes, and shadcn/ui components.
- **apps/viteWeb**: Vite + React app, fast local development, can also use shared UI components.
- **apps/expressWeb**: Express.js backend, TypeScript, for REST APIs or backend logic.
- **apps/socketWeb**: Socket.io backend, TypeScript, for real-time communication.

---

## Packages Overview

- **packages/ui**: shadcn/ui component library, all design system components live here. Consumed by frontend apps.
- **packages/common**: Shared types and utilities for both frontend and backend.
- **packages/backend-common**: Backend-specific shared code.
- **packages/eslint-config**: Centralized ESLint rules for consistent linting.
- **packages/typescript-config**: Centralized TypeScript configs for all packages/apps.

---

## UI Components (shadcn/ui)

- All UI components are in `packages/ui/src/components/`.
- To add a new component (e.g., `button`):
  ```bash
  pnpm dlx shadcn@latest add button -c apps/web
  ```
- Components are imported in apps like:
  ```tsx
  import { Button } from "@workspace/ui/components/button"
  ```

- Tailwind CSS is preconfigured. Global styles are in `packages/ui/src/styles/globals.css`.

---

## Development

- **Monorepo managed by pnpm workspaces**: All dependencies are hoisted and shared.
- **Turborepo**: Used for caching, running builds, and orchestrating tasks across packages/apps.
- **TypeScript**: Strict type safety across all packages and apps.
- **ESLint**: Centralized linting rules for code quality.

---

## Adding Components

To add shadcn/ui components to your app:

1. Run at the root of your `web` app:
   ```bash
   pnpm dlx shadcn@latest add <component> -c apps/web
   ```
2. Components will be placed in `packages/ui/src/components`.

---

## Using Shared Packages

- Import shared code from `@workspace/common`, `@workspace/backend-common`, or `@workspace/ui` in your apps.
- Example:
  ```tsx
  import { Button } from "@workspace/ui/components/button"
  import { SomeType } from "@workspace/common/types"
  ```

---

## Linting & Formatting

- Centralized ESLint config in `packages/eslint-config`.
- Run linting:
  ```bash
  pnpm lint
  ```

---

## TypeScript Configuration

- Centralized configs in `packages/typescript-config`.
- Each app/package extends the base config for consistency.

---

## Monorepo Management

- **pnpm**: Fast, disk-efficient package manager.
- **Turborepo**: For running scripts, builds, and caching.
- **Workspace scripts**: Use `pnpm --filter <app|package> <script>` to run scripts in a specific app/package.

---

## Scripts & Tooling

- **Build all**: `pnpm build`
- **Dev (per app)**: `pnpm --filter <app> dev`
- **Lint**: `pnpm lint`
- **Test**: (if tests are set up) `pnpm test`

---

## Contributing

1. Fork the repo and create your branch.
2. Make changes and commit.
3. Run lint and build to ensure everything works.
4. Submit a pull request.

---


# shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui.

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button"
```
