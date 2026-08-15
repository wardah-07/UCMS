# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

UCMS (University Club Management System) — an npm workspaces monorepo with three packages:

- `client/` — React 19 + TypeScript + Vite SPA (Tailwind CSS v4, TanStack Query, React Router 7, React Hook Form + Zod)
- `server/` — Express 5 API (Prisma ORM over PostgreSQL, JWT cookie auth, bcrypt)
- `shared/` — `@ucms/shared`, a workspace package exporting Zod schemas consumed by both client (form validation) and server (request validation), so validation rules only live in one place
- `0client/` — the pre-migration plain-JS client, kept temporarily as a reference during the JS→TS port; not built or run, safe to ignore otherwise

`client/` is mid-migration from JS to TS: files have been renamed `.jsx`/`.js` → `.tsx`/`.ts`, but most still contain unannotated JS logic (implicit `any`s throughout) rather than real TypeScript — don't assume a `.ts`/`.tsx` extension means the file is actually typed. Run `npx tsc -b --noEmit` from `client/` to see current type-error count/state. `@ucms/shared` is still plain `.js` with no type declarations, so anything imported from it currently comes through as `any` (`TS7016`) — no fix decided yet.

## Commands

Run from the repo root unless noted. There is no root test runner configured.

**Client** (`client/`, dev port 5003):
```
npm run dev --workspace=client      # vite dev server
npm run build --workspace=client    # tsc -b (typecheck) && vite build
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
JWT is issued on login/register and set as an httpOnly cookie (`sameSite: lax`, 15 min expiry) — the client never touches the token directly. `apiClient` (`client/src/lib/apiClient.ts`) is an axios instance with `withCredentials: true`. `GET /api/me` is the single source of truth for "who is logged in"; `fetchCurrentUser` (`client/src/features/auth/queries.ts`) treats a 401 as "not logged in" (resolves `null`) but rethrows other errors (e.g. network failures), so callers that don't expect a thrown error need to handle that case.

### Route protection is loader-based, not component-based
`client/src/app/routeGuards.ts` defines `redirectIfAuthenticated()` and `requireRole(role)`, both implemented as React Router loaders that call `queryClient.ensureQueryData` for the current-user query — this is the *same* cache entry `useCurrentUser()` reads, so the loader and any component on the page never fetch independently or disagree. Route → role mapping is centralized in `getHomeRouteForRole()` (`client/src/util/getHomeRouteForRole.ts`) and `ROUTES` (`client/src/constants/routes.ts`); reuse these instead of hardcoding paths or switching on `role` again.

Roles are `ADMIN`, `ORGANIZER`, `STUDENT` (see `server/prisma/schema.prisma`). New protected routes should get a `loader: requireRole("...")` in `client/src/app/router.tsx`, following the existing admin/organizer dashboard routes.

### Client feature-folder structure
Domain logic lives under `client/src/features/<domain>/` (e.g. `auth`, `users`): `api.ts` (axios calls), `queries.ts` (TanStack Query hooks), components, and an `index.ts` barrel that re-exports the public surface. Import from the barrel (`@/features/auth`) from outside the feature; files within a feature may import each other directly. `pages/` hold route-level components that compose features; `components/` hold cross-cutting UI (layout, generic UI primitives like `components/ui/ConfirmDialog.tsx`). Path alias `@` → `client/src` (configured in both `vite.config.ts`, for bundling, and `tsconfig.app.json`'s `compilerOptions.paths`, for type-checking — keep both in sync if it ever changes).

### Server request pipeline
Routes → `validateSchema(zodSchema)` middleware (parses/normalizes `req.body`, throws `AppError` with a 400 on failure) → `requireAuth` (verifies the JWT cookie, sets `req.user = { id, role }`) → `requireRoles([...])` / `requireClubManager` for authorization → controller. Controllers are async functions that `throw new AppError(message, statusCode)` on failure — Express 5 forwards rejected promises to `error.mw.js` automatically, which logs the error and responds `{ message }` (or a generic 500 for non-`AppError` failures). Follow this pattern for new endpoints rather than manual try/catch + res.status calls.

### Data model
See `server/prisma/schema.prisma`: `User` (role-based), `Club`, `Membership` (join table with an `isManager` flag used by `requireClubManager`), `Event` (belongs to a `Club`, created by a `User`, has a `PENDING`/`PUBLISHED`/`REJECTED` status).

## Styling

Tailwind CSS v4, configured CSS-first via `@theme` in `client/src/index.css` (no `tailwind.config.js`). The theme is a warm, soft light palette — semantic tokens `paper`/`surface`/`surface-muted`/`border`/`ink`/`ink-soft`/`brand`/`danger` (plus `-hover`/`-soft` variants) are defined there; use those utility classes (`bg-paper`, `text-ink-soft`, `bg-brand`, etc.) rather than raw Tailwind colors or hardcoded hex values so the theme stays centralized.
