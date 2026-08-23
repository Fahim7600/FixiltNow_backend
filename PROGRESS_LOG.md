# FixItNow Project Progress Log

## [2026-08-23] - Project Scaffolding & Initial Setup

### Packages Installed
- **Dependencies**: `express`, `cors`, `dotenv`, `jsonwebtoken`, `@prisma/client`
- **Dev Dependencies**: `typescript`, `ts-node-dev`, `@types/node`, `@types/express`, `@types/cors`, `@types/jsonwebtoken`, `prisma`, `eslint`, `prettier`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-config-prettier`, `eslint-plugin-prettier`

### Files & Directories Created
- `/src/modules/.gitkeep` — Placeholder directory for future feature modules (`auth`, `users`, `services`, `bookings`, `payments`, `reviews`, `categories`)
- `/src/middlewares/.gitkeep` — Placeholder directory for shared Express middlewares
- `/src/utils/.gitkeep` — Placeholder directory for shared helper utilities
- `/src/config/env.ts` — Environment variable loading and configuration (`dotenv`)
- `/src/routes/index.ts` — Central Express router aggregator containing health check route
- `/src/app.ts` — Express app setup (cors, json middleware, route mounting)
- `/src/server.ts` — Entry point starting Express server with exception handlers
- `tsconfig.json` — TypeScript configuration with strict mode (`strict: true`, `moduleResolution: bundler`)
- `eslint.config.js` & `.prettierrc` & `.prettierignore` — ESLint flat config (v10) and Prettier code formatting rules
- `.env.example` & `.env` — Environment configurations for `PORT`, `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `.gitignore` — Ignore patterns for `node_modules`, `dist`, `.env`, and log files
- `package.json` — Configured npm scripts: `"dev"`, `"build"`, `"start"`, `"lint"`
- `README.md` — Project documentation detailing modular folder conventions (`controller.ts`, `service.ts`, `route.ts`, `validation.ts`)
- `PROGRESS_LOG.md` — Project progress tracking log

### Key Decisions
- Configured ESLint v10 flat configuration (`eslint.config.js`) supporting TypeScript parser and Prettier integration.
- Set TypeScript `moduleResolution` to `"bundler"` for TypeScript 6 compatibility.
- Implemented modular architecture convention where feature modules follow a standard layout under `/src/modules/<name>`.

### Verification Result
- **Build**: `npm run build` completed cleanly without TypeScript compilation errors.
- **Lint**: `npm run lint` passed with zero errors.
- **Health Check**: Dev server executed (`npm run dev`) and `GET /api/health` returned:
  `{ "success": true, "message": "Server is healthy" }`

## [2026-08-23] - Task A: Replace ESLint/Prettier with Biome

### Packages Changed
- **Uninstalled**: `eslint`, `prettier`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-config-prettier`, `eslint-plugin-prettier`
- **Installed**: `@biomejs/biome`

### Files Removed & Created
- **Deleted**: `eslint.config.js`, `.prettierrc`, `.prettierignore`
- **Created**: `biome.json` (configured with 2-space indent, double quotes, semicolons, and recommended lint rules preset)
- **Updated**: `package.json` (replaced `"lint"` script with `biome check .` and added `"format"` script with `biome format --write .`)

### Key Decisions
- Adopted Biome as the single toolchain for linting and code formatting to simplify dev dependencies and improve performance.

### Verification Result
- **Format**: `npm run format` executed and formatted codebase according to Biome rules.
- **Lint**: `npm run lint` (`biome check .`) executed cleanly with 0 errors across 7 files.
- **Build**: `npm run build` compiled without errors.

## [2026-08-23] - Task B: Prisma + Postgres Connection

### Files & Configuration
- **Created**: `prisma/schema.prisma` with datasource (`postgresql`) and generator (`prisma-client-js`)
- **Created**: `prisma.config.ts` referencing `DATABASE_URL` from `.env`
- **Confirmed**: `DATABASE_URL` exists in `.env` and is referenced in `src/config/env.ts`

### Key Decisions
- Configured Prisma schema and `prisma.config.ts` using Prisma 7 standards for loading connection details from `DATABASE_URL`.

### Verification Results
- **Prisma Validate**: `npx prisma validate` succeeded (`The schema at prisma\schema.prisma is valid 🚀`).
- **Prisma Client Generation**: `npx prisma generate` generated Prisma Client (v7.9.1) without errors.
- **Database Connection Verification**: Ran `npx prisma db pull`. Raw output:
  ```text
  Loaded Prisma config from prisma.config.ts.

  Prisma schema loaded from prisma\schema.prisma.
  Datasource "db": PostgreSQL database "fixitnow_db", schema "public" at "localhost:5432"

  - Introspecting based on datasource defined in prisma\schema.prisma
  × Introspecting based on datasource defined in prisma\schema.prisma

  Error: P1001

  Can't reach database server at `localhost:5432`

  Please make sure your database server is running at `localhost:5432`.
  ```

## [2026-08-23] - Task A & B: Remote Prisma Connection & User Model Setup

### Packages Installed
- Installed `pg` and `@prisma/adapter-pg` (and `@types/pg`) for Prisma 7 Postgres driver adapter support.

### Files & Schema Changes
- **`prisma/schema.prisma`**: Added `Role` enum (`CUSTOMER`, `TECHNICIAN`, `ADMIN`), `UserStatus` enum (`ACTIVE`, `BANNED`), and `User` model (`id`, `name`, `email`, `password`, `phone`, `role`, `status`, `createdAt`, `updatedAt`).
- **`prisma.config.ts`**: Verified `import "dotenv/config";` loads `DATABASE_URL` from `.env`.

### Key Decisions
- Created database migration `20260823121243_add_user_model` to sync the User model with the remote Postgres instance.

### Verification Results
- **Prisma Validate**: `npx prisma validate` succeeded against `prisma.config.ts`.
- **Remote DB Pull Connection Test**: Output from `npx prisma db pull`:
  ```text
  Loaded Prisma config from prisma.config.ts.

  Prisma schema loaded from prisma\schema.prisma.
  Datasource "db": PostgreSQL database "postgres", schema "public" at "pooled.db.prisma.io:5432"

  - Introspecting based on datasource defined in prisma\schema.prisma
  × Introspecting based on datasource defined in prisma\schema.prisma
  Error: 
  P4001 The introspected database was empty:
  ```
- **Migration & Client Generation**: `npx prisma migrate dev --name add_user_model` applied migration to `pooled.db.prisma.io`, and `npx prisma generate` generated Prisma Client v7.9.1.
- **Table Verification**: Ran test script querying `prisma.user.findMany()`. Confirmed response: `CONFIRMED_REMOTE_DB: User table exists. Records count: 0`.
- **Repo Cleanup**: Deleted throwaway test script (`test-db.js`).
- **Lint & Build**: `npm run lint` and `npm run build` passed with zero errors.

## [2026-08-23] - Auth Module: User Registration Endpoint (`POST /api/auth/register`)

### Packages Installed
- **Dependencies**: `bcrypt`, `zod`
- **Dev Dependencies**: `@types/bcrypt`

### Files Created & Modified
- **`src/config/prisma.ts`**: Shared Prisma Client singleton configured with `@prisma/adapter-pg`.
- **`src/middlewares/validateRequest.ts`**: Generic Request validation middleware utilizing Zod schemas.
- **`src/modules/auth/validation.ts`**: Zod validation schema for registration (`name`, `email`, `password`, `phone`, `role`). Restricted `role` to `CUSTOMER` and `TECHNICIAN` only (`ADMIN` registration forbidden).
- **`src/modules/auth/service.ts`**: Auth service checking for email uniqueness, hashing passwords with bcrypt (10 rounds), persisting user via Prisma, and stripping `password` field before returning.
- **`src/modules/auth/controller.ts`**: Controller handling request/response, invoking auth service, returning standardized success (`{ success: true, message, data }`) or error (`{ success: false, message, errorDetails }`).
- **`src/modules/auth/route.ts`**: Routes mapping `POST /register` through `validateRequest(registerSchema)` middleware to `authController.register`.
- **`src/routes/index.ts`**: Mounted `authRoutes` under `/auth` (endpoint path: `/api/auth/register`).

### Key Decisions
- Encapsulated validation logic using Zod and created reusable `validateRequest` middleware.
- Restricted role input in registration schema to prevent unauthorized self-registration of `ADMIN` accounts.
- Enforced password exclusion at the service level so `password` is never returned in API payloads.

### Verification Results
1. **Valid Registration**: Sent POST request to `/api/auth/register` with valid user data.
   - Result: HTTP 201 response received (`success: true`). Returned user data included `id`, `name`, `email`, `phone`, `role`, `status`, `createdAt`, `updatedAt`. Confirmed `password` field was **NOT** in the response body.
2. **Duplicate Email Prevention**: Sent registration request with existing email (`john.doe@example.com`).
   - Result: HTTP 400 response with `{ success: false, message: 'User with this email already exists', errorDetails: 'User with this email already exists' }`. No raw Prisma crash.
3. **Validation Errors**: Sent registration request with invalid email format and short password.
   - Result: HTTP 400 response returning formatted validation errors (`name: Name must be at least 2 characters, email: Invalid email format, password: Password must be at least 8 characters`).
4. **Forbidden Role Registration**: Sent registration request with `role: "ADMIN"`.
   - Result: HTTP 400 response with `{ success: false, message: 'Validation Error', errorDetails: 'role: Role must be either CUSTOMER or TECHNICIAN' }`.
5. **Database Password Hashing**: Queried database directly using Prisma Client for `john.doe@example.com`.
   - Result: Confirmed stored password value is a 60-character bcrypt hash (`$2b$10$ZmqMeM.FjpfPn2MT9SFuguVCcN78GwF7mhD8U7FbivGgDGqIa4j3y`), not plaintext.
