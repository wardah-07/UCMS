# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

UCMS (University Club Management System) — an npm workspaces monorepo with three packages:

- `client/` — React 19 + Vite SPA (Tailwind CSS v4, TanStack Query, React Router 7, React Hook Form + Zod)
- `server/` — Express 5 API (Prisma ORM over PostgreSQL, JWT cookie auth, bcrypt)
- `shared/` — `@ucms/shared`, a workspace package exporting Zod schemas consumed by both client (form validation) and server (request validation), so validation rules only live in one place

## Commands

Run from the repo root unless noted. There is no root test runner configured.

**Client** (`client/`, dev port 5003):
```
npm run dev --workspace=client      # vite dev server
npm run build --workspace=client    # production build
npm run lint --workspace=client     # eslint
```

**Server** (`server/`, port 3003):
```
npm run dev --workspace=server      # nodemon server.js
npm run start --workspace=server    # node server.js
```

**Prisma** (run from `server/`):
```
npx prisma migrate dev      # create/apply a migration during development
npx prisma generate         # regenerate the Prisma client after schema changes
```

Both `client/` and `server/` have their own `.env` (not committed). The client needs `VITE_API_URL`; the server needs `DATABASE_URL` (PostgreSQL) and `JWT_SECRET`.

## Architecture

### Auth flow
JWT is issued on login/register and set as an httpOnly cookie (`sameSite: lax`, 15 min expiry) — the client never touches the token directly. `apiClient` (`client/src/lib/apiClient.js`) is an axios instance with `withCredentials: true`. `GET /api/me` is the single source of truth for "who is logged in"; `fetchCurrentUser` (`client/src/features/auth/queries.js`) treats a 401 as "not logged in" (resolves `null`) but rethrows other errors (e.g. network failures), so callers that don't expect a thrown error need to handle that case.

### Route protection is loader-based, not component-based
`client/src/app/routeGuards.js` defines `redirectIfAuthenticated()` and `requireRole(role)`, both implemented as React Router loaders that call `queryClient.ensureQueryData` for the current-user query — this is the *same* cache entry `useCurrentUser()` reads, so the loader and any component on the page never fetch independently or disagree. Route → role mapping is centralized in `getHomeRouteForRole()` (`client/src/util/getHomeRouteForRole.js`) and `ROUTES` (`client/src/constants/routes.js`); reuse these instead of hardcoding paths or switching on `role` again.

Roles are `ADMIN`, `ORGANIZER`, `STUDENT` (see `server/prisma/schema.prisma`). New protected routes should get a `loader: requireRole("...")` in `client/src/app/router.jsx`, following the existing admin/organizer dashboard routes.

### Client feature-folder structure
Domain logic lives under `client/src/features/<domain>/` (e.g. `auth`, `users`): `api.js` (axios calls), `queries.js` (TanStack Query hooks), components, and an `index.js` barrel that re-exports the public surface. Import from the barrel (`@/features/auth`) from outside the feature; files within a feature may import each other directly. `pages/` hold route-level components that compose features; `components/` hold cross-cutting UI (layout, generic UI primitives like `components/ui/ConfirmDialog.jsx`). Path alias `@` → `client/src` (configured in both `vite.config.js` and `jsconfig.json`).

### Server request pipeline
Routes → `validateSchema(zodSchema)` middleware (parses/normalizes `req.body`, throws `AppError` with a 400 on failure) → `requireAuth` (verifies the JWT cookie, sets `req.user = { id, role }`) → `requireRoles([...])` / `requireClubManager` for authorization → controller. Controllers are async functions that `throw new AppError(message, statusCode)` on failure — Express 5 forwards rejected promises to `error.mw.js` automatically, which logs the error and responds `{ error: message }` (or a generic 500 for non-`AppError` failures). Follow this pattern for new endpoints rather than manual try/catch + res.status calls.

### Data model
See `server/prisma/schema.prisma`: `User` (role-based), `Club`, `Membership` (join table with an `isManager` flag used by `requireClubManager`), `Event` (belongs to a `Club`, created by a `User`, has a `PENDING`/`PUBLISHED`/`REJECTED` status).

## Styling

Tailwind CSS v4, configured CSS-first via `@theme` in `client/src/index.css` (no `tailwind.config.js`). The theme is a warm, soft light palette — semantic tokens `paper`/`surface`/`surface-muted`/`border`/`ink`/`ink-soft`/`brand`/`danger` (plus `-hover`/`-soft` variants) are defined there; use those utility classes (`bg-paper`, `text-ink-soft`, `bg-brand`, etc.) rather than raw Tailwind colors or hardcoded hex values so the theme stays centralized.
