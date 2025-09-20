# JSONPlaceholder-style Backend (Node + TS + Express + Zod + SQLite)

A production-ready example backend that mirrors the core resources from https://jsonplaceholder.typicode.com:
- **/users, /posts, /comments, /todos** (CRUD, with relations)
- Optional: **/albums, /photos** (scaffolded for extension)

## Tech
- **Node.js 20+, TypeScript, Express**
- **Zod** validation + generated types
- **SQLite** (via `better-sqlite3`) with seed data
- **Pino** structured logging + request logging
- **Metrics** via `express-prom-bundle` at `/metrics`
- **OpenAPI** docs generated from Zod at `/docs`
- **Vitest** (unit & integration), **ESLint**, **Prettier**
- **Vite** for testing/dev tooling

## Getting Started

```bash
npm install
cp .env.example .env
npm run seed        # creates ./data/app.db, tables, and seed rows
npm run dev         # starts server on http://localhost:3000
```

Build and run:
```bash
npm run build
npm start
```

### API Docs
- Swagger UI: `http://localhost:3000/docs`
- Metrics (Prometheus format): `http://localhost:3000/metrics`

## Consuming the API
Example (fetch):
```ts
const res = await fetch('http://localhost:3000/api/users');
const users = await res.json();
```

## Project Structure
```
src/
  app.ts
  index.ts
  config/
  db/
  middleware/
  routes/
  controllers/
  services/
  schemas/
  models/
  utils/
  docs/
tests/
```

## Notes
- This is intentionally simple and self-contained for demo and teaching.
- Add auth, RBAC, caching, pagination, and rate limiting based on your needs.
