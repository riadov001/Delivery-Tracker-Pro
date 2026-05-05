# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Driver App (`artifacts/driver-app`) — Mobile (Expo)

Deliveroo-style driver delivery app with:
- **Map screen**: Dark GPS map, online/offline toggle, driver location tracking (expo-location), today's stats
- **Orders tab**: Available orders (auto-generated when online), order history, accept/decline flow
- **Active delivery**: Step-by-step flow (heading to restaurant → pick up → deliver), floating bottom bar
- **Earnings tab**: Today's earnings, weekly bar chart, base pay/tips/bonuses breakdown, boost promo
- **Profile tab**: Driver card with rating, badges, stats, account/preferences/support menus
- **react-native-maps@1.18.0** for native GPS map; custom dark grid placeholder on web
- **AsyncStorage** for persisting order history and delivery count
- **DriverContext**: Manages online status, current order, order history, earnings, mock order generation
- **LocationContext**: expo-location on native, navigator.geolocation on web

### API Server (`artifacts/api-server`)

Express 5 + TypeScript REST API. Currently has health check endpoint only.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
