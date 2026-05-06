# Delivery Platform (Jatekapoli)

Multi-role delivery platform: Client + Merchant + Driver + Admin.

## Run & Operate

| Command | Purpose |
|---|---|
| `pnpm run typecheck` | Full typecheck (libs + artifacts) |
| `pnpm run typecheck:libs` | Typecheck composite libs only |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks + Zod schemas from OpenAPI |
| `pnpm --filter @workspace/db run push` | Push DB schema to PostgreSQL (dev) |
| `pnpm --filter @workspace/api-server run typecheck` | Typecheck API server |

Required env vars: `DATABASE_URL`, `SESSION_SECRET` (used as JWT secret)

## Stack

- **Monorepo**: pnpm workspaces, Node.js 24, TypeScript 5.9
- **API**: Express 5 + Drizzle ORM + PostgreSQL
- **Auth**: JWT (access 15m / refresh 30d) via `jsonwebtoken` + `bcryptjs`
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Codegen**: Orval (OpenAPI → React Query hooks + Zod schemas)
- **Mobile**: Expo + Expo Router + react-native-maps

## Where things live

```
lib/
  db/src/schema/users.ts    — Users table + Drizzle schema + Zod schemas
  db/src/schema/index.ts    — Schema barrel (export all tables)
  api-spec/openapi.yaml     — OpenAPI spec (source of truth for API contract)
  api-spec/orval.config.ts  — Codegen config (Orval)
  api-client-react/src/     — Generated React Query hooks + custom-fetch
  api-zod/src/generated/    — Generated Zod validators (single file: api.zod.ts)

artifacts/
  api-server/src/
    routes/auth.ts          — POST /auth/register, /auth/login, /auth/refresh, GET /auth/me
    routes/health.ts        — GET /healthz
    middleware/auth.ts      — requireAuth(), requireRole(), signAccessToken(), signRefreshToken()
  driver-app/               — Expo mobile app (Driver role)
```

## Architecture decisions

- **JWT via SESSION_SECRET**: Access tokens expire in 15 min; refresh tokens in 30 days, stored in DB for rotation validation.
- **Role-based access**: `requireRole("ADMIN", "MERCHANT")` middleware composable per route.
- **Orval Zod mode: single**: Using `mode: "single"` for api-zod to avoid barrel name-clash between Zod schemas and TypeScript types in split mode.
- **custom-fetch**: Supports `setAuthTokenGetter()` for Bearer token injection — mobile apps set this after login.
- **DB schema composite lib**: `@workspace/db` is a composite TypeScript lib, built before leaf packages.

## Product

### Live now
- **Driver App** (Expo mobile) — Map, Orders, Earnings, Profile tabs with GPS tracking
- **API Server** — Auth endpoints: register, login, refresh, getMe

### User roles: `CLIENT` | `MERCHANT` | `DRIVER` | `ADMIN`

### Auth flow
1. `POST /api/auth/register` → returns `{ accessToken, refreshToken, user }`
2. `POST /api/auth/login` → same shape
3. `POST /api/auth/refresh` → rotates both tokens
4. `GET /api/auth/me` → `Authorization: Bearer <accessToken>`

## Gotchas

- Never import `react-native-maps` directly in web-rendered files — use `.native.tsx` / `.web.tsx` extensions.
- `pnpm --filter @workspace/db run push` requires `DATABASE_URL` to be set.
- After adding new OpenAPI endpoints, always run codegen: `pnpm --filter @workspace/api-spec run codegen`.
- The Orval Zod output uses `mode: "single"` targeting `generated/api.zod.ts`. Do not change to `mode: "split"` without removing the `schemas` option (causes duplicate exports).
- Do NOT run `pnpm dev` at the workspace root — use `restart_workflow` instead.
