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

## [2026-08-23] - Auth Module: User Login (`POST /api/auth/login`) & Profile Route (`GET /api/auth/me`)

### Files Created & Modified
- **`src/types/express.d.ts`**: Added custom TypeScript interface declaration extending Express `Request` with `user?: { userId: string; role: Role | string }`.
- **`src/modules/auth/validation.ts`**: Added `loginSchema` validating `email` and `password`.
- **`src/modules/auth/tempAuth.ts`**: Created temporary local auth guard middleware (`tempAuthGuard`) to verify JWT tokens from `Authorization: Bearer <token>` and populate `req.user`.
- **`src/modules/auth/service.ts`**: Implemented `loginUser` (credential validation, bcrypt comparison, `BANNED` status check, JWT generation) and `getMe` (retrieving user profile without password).
- **`src/modules/auth/controller.ts`**: Added `login` and `getMe` controllers returning standardized responses.
- **`src/modules/auth/route.ts`**: Mounted `POST /login` with `loginSchema` validation and `GET /me` with `tempAuthGuard`.

### Key Decisions
- Generic error messages ("Invalid credentials") for both missing users and incorrect passwords to prevent user enumeration attacks.
- JWT signed with `process.env.JWT_SECRET` and `process.env.JWT_EXPIRES_IN`, containing only `userId` and `role` in payload.
- Isolated temporary auth guard in `src/modules/auth/tempAuth.ts` clearly flagged for future migration to `src/middlewares`.

### Verification Results
1. **Valid Login**: `POST /api/auth/login` with `john.doe@example.com` / `password123`.
   - Result: Status 200 `{ success: true, message: "User logged in successfully", data: { token: "...", user: { id, name, email, phone, role, status, createdAt, updatedAt } } }`. Password field stripped.
2. **Invalid Password**: `POST /api/auth/login` with wrong password.
   - Result: Status 400 `{ success: false, message: "Invalid credentials", errorDetails: "Invalid credentials" }`.
3. **Non-existent Email**: `POST /api/auth/login` with non-existent email.
   - Result: Status 400 `{ success: false, message: "Invalid credentials", errorDetails: "Invalid credentials" }`. Same generic error as wrong password.
4. **GET /api/auth/me (Authenticated)**: Called with `Authorization: Bearer <token>`.
   - Result: Status 200 `{ success: true, message: "User profile retrieved successfully", data: { id, name, email, ... } }`. Password field stripped.
5. **GET /api/auth/me (Unauthenticated / Invalid Token)**:
   - No token: Status 401 `{ success: false, message: "Unauthorized", errorDetails: "No token provided" }`.
   - Invalid token: Status 401 `{ success: false, message: "Unauthorized", errorDetails: "Invalid or expired token" }`.
6. **JWT Payload Verification**: Decoded token payload (`userId`, `role`, `iat`, `exp`). Confirmed password is **NOT** included in the token.

## [2026-08-23] - Shared AuthGuard Middleware & Role-Based Access Control

### Files Created & Modified
- **`src/middlewares/authGuard.ts`**: Created shared authentication and authorization middleware:
  - `authenticate`: Validates `Bearer` JWT token from `Authorization` header and attaches `{ userId, role }` to `req.user`.
  - `authorize(...allowedRoles)`: Higher-order middleware checking whether `req.user.role` matches allowed roles (returns 403 Forbidden on mismatch).
- **`src/modules/auth/tempAuth.ts`**: Deleted temporary auth guard file.
- **`src/modules/auth/route.ts`**: Updated `GET /me` to use `authenticate` from `authGuard.ts`. Added temporary `GET /test-admin-only` route protected by `authenticate` + `authorize('ADMIN')`.

### Key Decisions
- Formalized authentication and authorization into reusable middlewares (`authenticate`, `authorize`) in `src/middlewares/authGuard.ts`.
- Standardized error response shape for authentication (401) and authorization (403) failures (`{ success: false, message, errorDetails }`).

### Verification Results
1. **GET /api/auth/me Regression Check**: Executed request with valid CUSTOMER token.
   - Result: Status 200 `{ success: true, message: "User profile retrieved successfully", data: { id, name, email, ... } }`.
2. **Forbidden Access Test**: Executed `GET /api/auth/test-admin-only` with CUSTOMER token.
   - Result: Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
3. **Unauthenticated Test**: Executed `GET /api/auth/test-admin-only` with no token header.
   - Result: Status 401 `{ success: false, message: "Unauthorized", errorDetails: "No token provided" }`.
4. **Authorized Admin Test**: Created test admin user (`admin.test@example.com`), logged in to retrieve ADMIN JWT token, and executed `GET /api/auth/test-admin-only`.
   - Result: Status 200 `{ success: true, message: "You are an admin" }`.
5. **Clean Codebase**: Verified `src/modules/auth/tempAuth.ts` is deleted and no longer present.

## [2026-08-23] - Global Error Handling, AppError Class & AsyncHandler Utility

### Files Created & Refactored
- **`src/utils/AppError.ts`**: Created custom `AppError` class extending `Error` with `statusCode`, `message`, and `errorDetails` fields.
- **`src/utils/asyncHandler.ts`**: Created `asyncHandler` higher-order wrapper catching async errors and forwarding to Express `next(err)`.
- **`src/middlewares/errorHandler.ts`**: Created global 4-argument Express error handling middleware:
  - Formats `AppError`, `ZodError`, and Prisma known errors (`P2002`, `P2025`).
  - Catches unexpected errors, logs details server-side (`console.error`), and returns safe HTTP 500 response (`{ success: false, message: "Something went wrong", errorDetails: "Internal server error" }`).
- **`src/middlewares/notFoundHandler.ts`**: Created 404 handler for undefined routes (`{ success: false, message: "Route not found", errorDetails }`).
- **`src/app.ts`**: Registered `notFoundHandler` after routes and `errorHandler` as the final middleware.
- **`src/modules/auth/service.ts`**: Replaced generic `Error` objects with `AppError(statusCode, message)`.
- **`src/modules/auth/controller.ts`**: Wrapped all controller handlers in `asyncHandler`, eliminating manual `try/catch` boilerplate.

### Key Decisions
- Centralized all error formatting and HTTP status mapping into `src/middlewares/errorHandler.ts`.
- Standardized error response shape across entire API: `{ success: false, message: "...", errorDetails: "..." }`.

### Verification Results
1. **Duplicate Email Registration**: Sent registration request with existing email.
   - Result: Status 400 `{ success: false, message: "User with this email already exists", errorDetails: "User with this email already exists" }`.
2. **Invalid Password Login**: Sent login request with wrong password.
   - Result: Status 400 `{ success: false, message: "Invalid credentials", errorDetails: "Invalid credentials" }`.
3. **Unauthenticated GET /me**: Called `GET /api/auth/me` without Authorization header.
   - Result: Status 401 `{ success: false, message: "Unauthorized", errorDetails: "No token provided" }`.
4. **Forbidden Access**: Called `GET /api/auth/test-admin-only` with CUSTOMER token.
   - Result: Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
5. **Undefined Route Handling**: Sent request to `GET /api/nonexistent`.
   - Result: Status 404 `{ success: false, message: "Route not found", errorDetails: "Cannot GET /api/nonexistent" }`.
6. **Unexpected Server Error (500)**: Triggered route throwing an unexpected `Error`.
   - Result: Status 500 `{ success: false, message: "Something went wrong", errorDetails: "Internal server error" }` without leaking stack trace to client; full error stack was logged server-side (`Unhandled Error: Error: Simulated unexpected database failure`).

## [2026-08-23] - Hardened Input Validation & Auth Rate Limiting

### Packages Installed
- **Dependencies**: `express-rate-limit`

### Files Created & Refactored
- **`src/modules/auth/validation.ts`**:
  - Added `.trim().toLowerCase()` to email field in `registerSchema` and `loginSchema`.
  - Added `.trim()` to name field.
  - Added phone format regex validation (`/^\+?[0-9\s-]{7,15}$/`).
  - Enforced password complexity rule (`/^(?=.*[a-zA-Z])(?=.*\d)/`, "Password must contain at least one letter and one number").
- **`src/modules/auth/service.ts`**: Normalized email inputs with `.trim().toLowerCase()` consistently in `registerUser` and `loginUser`.
- **`src/middlewares/rateLimiter.ts`**: Created IP rate limiters using `express-rate-limit`:
  - `loginLimiter`: Max 5 attempts per 15 minutes, returning HTTP 429 with standard JSON shape (`{ success: false, message: "Too many login attempts, please try again later", errorDetails: "..." }`).
  - `registerLimiter`: Max 10 attempts per hour, returning HTTP 429 with standard JSON shape (`{ success: false, message: "Too many registration attempts, please try again later", errorDetails: "..." }`).
- **`src/modules/auth/route.ts`**: Applied `registerLimiter` to `POST /register` and `loginLimiter` to `POST /login`.

### Key Decisions
- Standardized rate limit error responses to match global JSON response format instead of `express-rate-limit` plain text default.
- Implemented case-insensitive email processing across validation schemas and database queries to avoid duplicate accounts caused by casing.

### Verification Results
1. **Case-Insensitive Email Registration**: Registered `Test@Example.com` then attempted registering `test@example.com`.
   - Result: Second attempt rejected with HTTP 400 (`User with this email already exists`). Stored email normalized to `test@example.com`.
2. **Password Complexity Validation**: Attempted registering with password `12345678` (digits only).
   - Result: Rejected with HTTP 400 (`password: Password must contain at least one letter and one number`).
3. **Phone Number Format Validation**: Attempted registering with `phone: "abc"` then `phone: "+1-234-567-8901"`.
   - Result: `abc` rejected with HTTP 400 (`phone: Invalid phone number format`). Valid phone accepted with HTTP 201.
4. **Login Rate Limiting**: Sent 6 consecutive invalid login attempts to `POST /api/auth/login`.
   - Result: Attempt 6 returned HTTP 429 (`{ success: false, message: "Too many login attempts, please try again later", errorDetails: "Too many login attempts, please try again later" }`).
5. **Baseline Login Under Limit**: Confirmed login logic continues to work normally under rate limit thresholds.

## [2026-08-23] - Categories Module & Admin Routing

### Database Changes
- **`prisma/schema.prisma`**: Added `Category` model (`id`, `name`, `description`, `createdAt`, `updatedAt`).
- Applied migration `20260823124558_add_category_model` to remote database and regenerated Prisma Client.

### Files Created & Refactored
- **`src/modules/categories/validation.ts`**: `createCategorySchema` requiring `name` (trimmed, min 2 chars) and optional `description`.
- **`src/modules/categories/service.ts`**:
  - `createCategory`: Checks for case-insensitive duplicate names using Prisma `mode: "insensitive"`. Throws `AppError(400, "Category already exists")` on duplicate.
  - `getAllCategories`: Retrieves all categories ordered by `name` ascending.
- **`src/modules/categories/controller.ts`**: Handlers `createCategory` (201) and `getAllCategories` (200) wrapped in `asyncHandler`.
- **`src/modules/categories/route.ts`**: Exposes public `GET /` route.
- **`src/modules/admin/route.ts`**: Exposes admin-only `POST /categories` route protected by `authenticate`, `authorize('ADMIN')`, and `validateRequest(createCategorySchema)`.
- **`src/routes/index.ts`**: Mounted `categoryRoutes` under `/categories` and `adminRoutes` under `/admin`.

### Key Decisions / Routing Architecture
- Created `src/modules/admin/route.ts` mounted at `/api/admin` in `src/routes/index.ts` to satisfy the project specification's `POST /api/admin/categories` endpoint while keeping category domain logic encapsulated in `src/modules/categories/`.

### Verification Results
1. **Unauthenticated Public Categories Retrieval**: Called `GET /api/categories` with no auth headers.
   - Result: Status 200 `{ success: true, message: "Categories fetched successfully", data: [] }`.
2. **Customer Access Denial**: Sent `POST /api/admin/categories` with CUSTOMER token.
   - Result: Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
3. **Unauthenticated Admin Route Access**: Sent `POST /api/admin/categories` with no token.
   - Result: Status 401 `{ success: false, message: "Unauthorized", errorDetails: "No token provided" }`.
4. **Authorized Category Creation**: Sent `POST /api/admin/categories` with ADMIN token (`name: "Plumbing"`).
   - Result: Status 201 `{ success: true, message: "Category created successfully", data: { id, name: "Plumbing", description: "...", ... } }`.
5. **Case-Insensitive Duplicate Prevention**: Sent `POST /api/admin/categories` with ADMIN token (`name: "plumbing"`).
   - Result: Status 400 `{ success: false, message: "Category already exists", errorDetails: "Category already exists" }`.
6. **Populated Categories Listing**: Called `GET /api/categories` with no auth headers.
   - Result: Status 200 returning array containing newly created `Plumbing` category object.
7. **Validation Failure Handling**: Sent `POST /api/admin/categories` with invalid data (`name: "  "`).
   - Result: Status 400 `{ success: false, message: "Validation Error", errorDetails: "name: Category name must be at least 2 characters" }`.
