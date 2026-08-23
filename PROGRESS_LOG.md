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

## [2026-08-23] - Technician Profile Module & Own Profile Management

### Database Changes
- **`prisma/schema.prisma`**: Added `TechnicianProfile` model (`id`, `userId` unique relation to `User`, `bio`, `skills`, `experienceYears`, `hourlyRate`, `avgRating`, `totalReviews`, `createdAt`, `updatedAt`). Added `technicianProfile` inverse relation field to `User`.
- Applied migration `20260823125158_add_technician_profile_model` to remote Postgres database and regenerated Prisma Client.

### Files Created & Refactored
- **`src/modules/technicianProfile/validation.ts`**: `upsertProfileSchema` validating optional `bio`, `skills` array, `experienceYears` (min 0), and positive `hourlyRate` (`> 0`).
- **`src/modules/technicianProfile/service.ts`**:
  - `upsertProfile`: Creates or updates technician profile for `userId` using Prisma `upsert`.
  - `getMyProfile`: Fetches profile for `userId`; throws `AppError(404, "Profile not found. Please create your technician profile first.")` if missing.
- **`src/modules/technicianProfile/controller.ts`**: Express handlers `upsertProfile` and `getMyProfile` wrapped in `asyncHandler`.
- **`src/modules/technicianProfile/route.ts`**: Routes `PUT /profile` and `GET /profile` protected by `authenticate` + `authorize('TECHNICIAN')`.
- **`src/routes/index.ts`**: Mounted `technicianProfileRoutes` under `/technician` (endpoints `PUT /api/technician/profile`, `GET /api/technician/profile`).

### Verification Results
1. **Technician Account Registration & Login**: Registered `tech.john@example.com` (`role: TECHNICIAN`), logged in, and obtained JWT token.
2. **Missing Profile Lookup**: Called `GET /api/technician/profile` prior to profile creation.
   - Result: Status 404 `{ success: false, message: "Profile not found. Please create your technician profile first.", errorDetails: "Profile not found. Please create your technician profile first." }`.
3. **Profile Creation**: Sent `PUT /api/technician/profile` with valid payload (`bio: "Expert plumber"`, `skills: ["Pipe repair", "Installation"]`, `experienceYears: 5`, `hourlyRate: 25.50`).
   - Result: Status 200 `{ success: true, message: "Technician profile saved successfully", data: { id, userId, bio, skills, hourlyRate: "25.5", ... } }`.
4. **Profile Retrieval**: Called `GET /api/technician/profile` after creation.
   - Result: Status 200 returning saved profile data.
5. **Profile Update & Idempotency**: Sent `PUT /api/technician/profile` with updated `hourlyRate: 30.00`.
   - Result: Status 200 returning updated profile. Database check confirmed exactly 1 `TechnicianProfile` row for `userId`.
6. **Negative Rate Validation**: Sent `PUT /api/technician/profile` with `hourlyRate: -5`.
   - Result: Status 400 `{ success: false, message: "Validation Error", errorDetails: "hourlyRate: Hourly rate must be a positive number" }`.
7. **Role Restriction (CUSTOMER)**: Sent `PUT /api/technician/profile` using a CUSTOMER token.
   - Result: Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
8. **Unauthenticated Access**: Sent `PUT /api/technician/profile` with no Authorization header.
   - Result: Status 401 `{ success: false, message: "Unauthorized", errorDetails: "No token provided" }`.

## [2026-08-23] - Services Module & Technician Service Management

### Database Changes
- **`prisma/schema.prisma`**: Added `Service` model (`id`, `technicianProfileId` relation to `TechnicianProfile`, `categoryId` relation to `Category`, `title`, `description`, `price`, `isActive`, `createdAt`, `updatedAt`). Added `services Service[]` relations on both `Category` and `TechnicianProfile`.
- Applied migration `20260823172059_add_service_model` to remote Postgres database and regenerated Prisma Client.

### Files Created & Refactored
- **`src/modules/services/validation.ts`**:
  - `createServiceSchema`: Validates `categoryId` (uuid), `title` (min 3 chars), optional `description`, and `price` (`> 0`).
  - `updateServiceSchema`: Partial update validation for `categoryId`, `title`, `description`, `price`, and `isActive`.
- **`src/modules/services/service.ts`**:
  - `createService`: Verifies caller has a `TechnicianProfile` and that `categoryId` exists. Links service to caller's `technicianProfileId`.
  - `getMyServices`: Lists caller's services ordered by `createdAt` descending.
  - `updateService`: Verifies caller owns the target service before applying partial updates.
  - `deleteService`: Verifies ownership and deletes the service.
- **`src/modules/services/controller.ts`**: Handlers `createService` (201), `getMyServices` (200), `updateService` (200), and `deleteService` (200) wrapped in `asyncHandler`.
- **`src/modules/services/route.ts`**: Mounted `POST /`, `GET /`, `PATCH /:id`, `DELETE /:id` protected by `authenticate` + `authorize('TECHNICIAN')`.
- **`src/routes/index.ts`**: Mounted `serviceRoutes` under `/technician/services`.

### Routing Architecture Decision
- Mounted `serviceRoutes` under `/technician/services` directly in `src/routes/index.ts`. This provides clean, top-level path mapping for `POST/GET/PATCH/DELETE /api/technician/services` while maintaining full domain encapsulation in `src/modules/services/`.

### Verification Results
1. **Unprofiled Technician Listing Prevention**: Called `POST /api/technician/services` using a fresh technician account without a profile.
   - Result: Status 404 `{ success: false, message: "Please create your technician profile before adding services", errorDetails: "..." }`.
2. **Valid Service Creation**: Profiled technician called `POST /api/technician/services` with valid `categoryId`, `title`, `price`.
   - Result: Status 201 `{ success: true, message: "Service created successfully", data: { id, title: "Emergency Pipe Leak Repair", price: "75", ... } }`.
3. **Invalid Category Validation**: Called `POST /api/technician/services` with non-existent `categoryId`.
   - Result: Status 400 `{ success: false, message: "Invalid category", errorDetails: "Invalid category" }`.
4. **My Services Retrieval**: Technician called `GET /api/technician/services`.
   - Result: Status 200 returning list containing only technician's own services.
5. **Cross-Technician Ownership Enforcement**: Registered Technician 2, logged in, and attempted `PATCH /api/technician/services/:id` on Technician 1's service.
   - Result: Status 403 `{ success: false, message: "You can only modify your own services", errorDetails: "You can only modify your own services" }`.
6. **Partial Service Update**: Owner called `PATCH /api/technician/services/:id` with `{ price: 85.00 }`.
   - Result: Status 200 showing `price` updated to `"85"` while title/description remained intact.
7. **Service Deletion**: Owner called `DELETE /api/technician/services/:id`.
   - Result: Status 200 `{ success: true, message: "Service deleted successfully" }`. Subsequent `GET /api/technician/services` confirmed `data: []`.
8. **Negative Price Validation**: Called `POST /api/technician/services` with `price: -10`.
   - Result: Status 400 `{ success: false, message: "Validation Error", errorDetails: "price: Price must be a positive number" }`.

## [2026-08-23] - Public Catalog Browsing Module (`/api/services` & `/api/technicians`)

### Database Changes
- **`prisma/schema.prisma`**: Added optional `location String?` field to `TechnicianProfile` model.
- Applied migration `20260823173831_add_technician_location` to remote Postgres database and regenerated Prisma Client.
- Updated `src/modules/technicianProfile/validation.ts` (`upsertProfileSchema`) and `src/modules/technicianProfile/service.ts` (`upsertProfile`) to support the `location` field.

### Files Created & Refactored
- **`src/middlewares/validateRequest.ts`**: Added `validateQuery` middleware to validate and sanitize Express request query parameters using Zod schemas.
- **`src/modules/catalog/validation.ts`**:
  - `servicesQuerySchema`: Validates query parameters for `GET /api/services` (`categoryId` UUID, `search` string, `minPrice` number, `maxPrice` number, `location` string, `sortBy` enum, `page` min 1, `limit` min 1 max 50).
  - `techniciansQuerySchema`: Validates query parameters for `GET /api/technicians` (`search` string, `location` string, `minRating` number, `skills` string, `page` min 1, `limit` min 1 max 50).
- **`src/modules/catalog/service.ts`**:
  - `getPublicServices`: Retrieves active services (`isActive: true`) filtered by category, search term (case-insensitive title match), price range, and technician location (case-insensitive location match). Includes category name and technician details. Returns paginated shape (`items`, `total`, `page`, `totalPages`).
  - `getPublicTechnicians`: Retrieves active technician profiles (`User.status: "ACTIVE"`) filtered by name, location, min rating, and skills. Excludes private user fields (`email`, `phone`, `password`). Returns paginated shape (`items`, `total`, `page`, `totalPages`).
  - `getTechnicianById`: Returns full public profile for a technician including their active services and a `reviews: []` placeholder (TODO for future reviews module). Throws `AppError(404, "Technician not found")` if missing.
- **`src/modules/catalog/controller.ts`**: Handlers `getServices`, `getTechnicians`, and `getTechnicianById` wrapped in `asyncHandler`.
- **`src/modules/catalog/route.ts`**: Exports `publicServicesRouter` and `publicTechniciansRouter`.
- **`src/routes/index.ts`**: Mounted `publicServicesRouter` at `/services` (`GET /api/services`) and `publicTechniciansRouter` at `/technicians` (`GET /api/technicians`, `GET /api/technicians/:id`).

### Task D Note (Categories Passthrough)
- Confirmed `GET /api/categories` built previously is sufficient as-is for public category list used in frontend filter dropdowns.

### Verification Results
1. **Unfiltered Public Services Retrieval**: Called `GET /api/services` with no filters.
   - Result: Status 200 `{ success: true, message: "Services retrieved successfully", data: { items, total, page, totalPages } }`. Confirmed inactive services (`isActive: false`) are excluded.
2. **Search Filter Test**: Called `GET /api/services?search=pipe`.
   - Result: Status 200 returning services matching title "pipe" (case-insensitive).
3. **Price Range Filter Test**: Called `GET /api/services?minPrice=50&maxPrice=100`.
   - Result: Status 200 returning services priced between 50 and 100.
4. **Category Filter Test**: Called `GET /api/services?categoryId=<real-id>`.
   - Result: Status 200 returning services linked to specified category ID.
5. **Pagination Metadata Test**: Called `GET /api/services?page=1&limit=1`.
   - Result: Status 200 returning `total: 3, page: 1, totalPages: 3` with 1 item in `items`.
6. **Public Technicians Browsing & Privacy Check**: Called `GET /api/technicians` with no filters.
   - Result: Status 200 returning technician profiles. Verified `email`, `phone`, `password` fields are **NOT** present in any items.
7. **Location Filter Test**: Updated technician profile with `location: "Dallas, TX"` then called `GET /api/technicians?location=dallas`.
   - Result: Status 200 returning matching Dallas technician.
8. **Valid Technician Profile Retrieval**: Called `GET /api/technicians/:id` with valid technician ID.
   - Result: Status 200 returning full technician profile, active services list, and `reviews: []` placeholder.
9. **Invalid Technician Profile Lookup**: Called `GET /api/technicians/00000000-0000-0000-0000-000000000000`.
   - Result: Status 404 `{ success: false, message: "Technician not found", errorDetails: "Technician not found" }`.

## [2026-08-23] - Technician Availability Module & Overlap Prevention

### Database Changes
- **`prisma/schema.prisma`**: Added `Availability` model (`id`, `technicianProfileId` relation to `TechnicianProfile`, `dayOfWeek` int 0-6, `startTime` string "HH:mm", `endTime` string "HH:mm", `createdAt`). Added `availability Availability[]` relation to `TechnicianProfile`.
- Applied migration `20260823174407_add_availability_model` to remote Postgres database and regenerated Prisma Client.

### Files Created & Refactored
- **`src/modules/availability/validation.ts`**:
  - `createAvailabilitySchema`: Validates `dayOfWeek` (int 0-6), `startTime` ("HH:mm" regex format), and `endTime` ("HH:mm" regex format). Refined with a check requiring `endTime > startTime` ("End time must be after start time").
- **`src/modules/availability/service.ts`**:
  - `addAvailability`: Verifies caller has a `TechnicianProfile`. Checks for overlapping time slots on the same `dayOfWeek` (`newStart < existingEnd && newEnd > existingStart`). Throws `AppError(400, "This time slot overlaps with an existing availability window")` on overlap. Creates slot if clean.
  - `getMyAvailability`: Retrieves caller's availability slots ordered by `dayOfWeek` ascending then `startTime` ascending.
  - `deleteAvailability`: Verifies ownership of the availability slot (`technicianProfile.userId === userId`). Throws `AppError(403, "You can only delete your own availability windows")` if unauthorized. Deletes slot.
- **`src/modules/availability/controller.ts`**: Express handlers `addAvailability` (201), `getMyAvailability` (200), and `deleteAvailability` (200) wrapped in `asyncHandler`.
- **`src/modules/availability/route.ts`**: Mounted `POST /`, `GET /`, `DELETE /:id` protected by `authenticate` + `authorize('TECHNICIAN')`.
- **`src/routes/index.ts`**: Mounted `availabilityRoutes` under `/technician/availability`.

### Verification Results
1. **Valid Availability Window Creation**: Called `POST /api/technician/availability` with valid data (`dayOfWeek: 1, startTime: "09:00", endTime: "17:00"`).
   - Result: Status 201 `{ success: true, message: "Availability window added successfully", data: { id, dayOfWeek: 1, startTime: "09:00", endTime: "17:00", ... } }`.
2. **Overlapping Window Prevention**: Called `POST /api/technician/availability` with an overlapping slot (`dayOfWeek: 1, startTime: "12:00", endTime: "18:00"`).
   - Result: Status 400 `{ success: false, message: "This time slot overlaps with an existing availability window", errorDetails: "..." }`.
3. **Adjacent / Non-Overlapping Window Creation**: Called `POST /api/technician/availability` with a non-overlapping slot (`dayOfWeek: 1, startTime: "18:00", endTime: "20:00"`).
   - Result: Status 201 `{ success: true, message: "Availability window added successfully", data: { id, dayOfWeek: 1, startTime: "18:00", endTime: "20:00", ... } }`.
4. **Invalid End Time Order Validation**: Called `POST /api/technician/availability` with `endTime` before `startTime` (`startTime: "17:00", endTime: "09:00"`).
   - Result: Status 400 `{ success: false, message: "Validation Error", errorDetails: "endTime: End time must be after start time" }`.
5. **Time Format Regex Validation**: Called `POST /api/technician/availability` with invalid format (`startTime: "9am"`).
   - Result: Status 400 `{ success: false, message: "Validation Error", errorDetails: "startTime: Start time must be in HH:mm format, ..." }`.
6. **My Availability Retrieval & Sorting**: Called `GET /api/technician/availability`.
   - Result: Status 200 returning caller's windows ordered by `dayOfWeek` then `startTime` (`09:00 - 17:00`, `18:00 - 20:00`).
7. **Cross-Technician Deletion Prevention**: Registered Technician 2, logged in, and attempted `DELETE /api/technician/availability/:id` on Technician 1's slot.
   - Result: Status 403 `{ success: false, message: "You can only delete your own availability windows", errorDetails: "..." }`.
8. **Owner Deletion Verification**: Technician 1 called `DELETE /api/technician/availability/:id` on their own slot.
   - Result: Status 200 `{ success: true, message: "Availability window deleted successfully" }`. Follow-up `GET` confirmed slot `09:00 - 17:00` was removed.

## [2026-08-23] - Bookings Module: Customer Booking Creation (`POST /api/bookings`)

### Database Changes
- **`prisma/schema.prisma`**:
  - Added `BookingStatus` enum (`REQUESTED`, `ACCEPTED`, `DECLINED`, `PAID`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
  - Added `Booking` model (`id`, `customerId` relation to `User`, `technicianProfileId` relation to `TechnicianProfile`, `serviceId` relation to `Service`, `scheduledDate` DateTime, `status` default `REQUESTED`, `priceAtBooking` Decimal, `notes` optional string, `createdAt`, `updatedAt`).
  - Added inverse `bookings Booking[]` relation fields on `User`, `TechnicianProfile`, and `Service`.
- Applied migration `20260823174824_add_booking_model` to remote Postgres database and regenerated Prisma Client.

### Files Created & Refactored
- **`src/modules/bookings/validation.ts`**:
  - `createBookingSchema`: Validates `serviceId` (UUID format), `scheduledDate` (ISO datetime string, refined with a future date check `new Date(val) > new Date()`), and optional `notes`.
- **`src/modules/bookings/service.ts`**:
  - `createBooking`: Fetches target service by `serviceId` with `technicianProfile`. Throws `AppError(404, "Service not found")` if missing. Verifies `service.isActive === true` (throws `AppError(400, "This service is not currently available for booking")` if inactive). Snapshots current price into `priceAtBooking`. Creates booking with status `REQUESTED` and includes service title & technician name in the response payload.
- **`src/modules/bookings/controller.ts`**: Express handler `createBooking` (201) wrapped in `asyncHandler`.
- **`src/modules/bookings/route.ts`**: Mounted `POST /` protected by `authenticate` + `authorize('CUSTOMER')` and `validateRequest(createBookingSchema)`.
- **`src/routes/index.ts`**: Mounted `bookingRoutes` under `/bookings` (`POST /api/bookings`).

### Verification Results
1. **Valid Booking Request Creation**: CUSTOMER token called `POST /api/bookings` with valid future date and active `serviceId`.
   - Result: Status 201 `{ success: true, message: "Booking request created successfully", data: { id, customerId, status: "REQUESTED", priceAtBooking: "120", service: { title: "AC Maintenance" }, technicianProfile: { user: { name: "Booking Tech" } } } }`.
2. **Past Scheduled Date Rejection**: Customer called `POST /api/bookings` with a date in the past.
   - Result: Status 400 `{ success: false, message: "Validation Error", errorDetails: "scheduledDate: Scheduled date must be a future date" }`.
3. **Inactive Service Booking Rejection**: Customer called `POST /api/bookings` targeting an inactive service (`isActive: false`).
   - Result: Status 400 `{ success: false, message: "This service is not currently available for booking", errorDetails: "..." }`.
4. **Nonexistent Service ID Handling**: Customer called `POST /api/bookings` with non-existent valid UUID `serviceId`.
   - Result: Status 404 `{ success: false, message: "Service not found", errorDetails: "Service not found" }`.
5. **Technician Access Denial**: Called `POST /api/bookings` using a TECHNICIAN token.
   - Result: Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
6. **Admin Access Denial**: Called `POST /api/bookings` using an ADMIN token.
   - Result: Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
7. **Unauthenticated Access Denial**: Called `POST /api/bookings` with no Authorization header.
   - Result: Status 401 `{ success: false, message: "Unauthorized", errorDetails: "No token provided" }`.
8. **Malformed Service ID Handling**: Called `POST /api/bookings` with `serviceId: "abc123"`.
   - Result: Status 400 `{ success: false, message: "Validation Error", errorDetails: "serviceId: Invalid service ID format" }`.

## [2026-08-23] - Bookings Module: Listing & Detail Retrieval Endpoints (`GET /api/bookings` & `GET /api/bookings/:id`)

### Files Created & Refactored
- **`src/modules/bookings/service.ts`**:
  - `getMyBookings`: Returns role-scoped bookings ordered by `createdAt` descending. If caller is a `CUSTOMER`, returns their bookings with technician's name (excluding email/phone). If caller is a `TECHNICIAN`, returns bookings linked to their `TechnicianProfile` with customer's name (excluding email/phone).
  - `getBookingById`: Fetches full booking details. Performs ownership check (`customerId === userId` for CUSTOMER, `technicianProfile.userId === userId` for TECHNICIAN). Throws `AppError(403, "You do not have permission to view this booking")` if unauthorized. Throws `AppError(404, "Booking not found")` if missing.
- **`src/modules/bookings/controller.ts`**: Added `getMyBookings` (200) and `getBookingById` (200) handlers wrapped in `asyncHandler`.
- **`src/modules/bookings/route.ts`**: Mounted `GET /` and `GET /:id` protected by `authenticate` + `authorize('CUSTOMER', 'TECHNICIAN')`.
- **Admin Visibility Decision Note**: Admin access to `/api/bookings` is explicitly restricted (HTTP 403) and deliberately deferred to Prompt 22 for a dedicated global admin booking management view.

### Verification Results
1. **Customer Booking Listing**: Called `GET /api/bookings` as CUSTOMER.
   - Result: Status 200 `{ success: true, message: "Bookings retrieved successfully", data: [ { id, scheduledDate, status, priceAtBooking, service: { title }, technician: { name: "List Tech" } } ] }`. Verified email and phone are not present.
2. **Technician Booking Listing**: Called `GET /api/bookings` as TECHNICIAN.
   - Result: Status 200 `{ success: true, message: "Bookings retrieved successfully", data: [ { id, scheduledDate, status, priceAtBooking, service: { title }, customer: { name: "List Customer 1" } } ] }`. Verified email and phone are not present.
3. **Empty Customer Booking Listing**: Called `GET /api/bookings` as a CUSTOMER with no bookings.
   - Result: Status 200 `{ success: true, message: "Bookings retrieved successfully", data: [] }`.
4. **Owner Customer Details Retrieval**: Called `GET /api/bookings/:id` as the CUSTOMER who owns the booking.
   - Result: Status 200 returning full booking details.
5. **Unrelated Customer Details Denial**: Called `GET /api/bookings/:id` as an unrelated CUSTOMER.
   - Result: Status 403 `{ success: false, message: "You do not have permission to view this booking", errorDetails: "..." }`.
6. **Technician Details Retrieval**: Called `GET /api/bookings/:id` as the TECHNICIAN assigned to the booking.
   - Result: Status 200 returning full booking details.
7. **Nonexistent Booking Details Lookup**: Called `GET /api/bookings/00000000-0000-0000-0000-000000000000`.
   - Result: Status 404 `{ success: false, message: "Booking not found", errorDetails: "Booking not found" }`.
8. **Admin Token Restriction**: Called `GET /api/bookings` or `GET /api/bookings/:id` using an ADMIN token.
   - Result: Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
9. **Unauthenticated Access Denial**: Called `GET /api/bookings` without Authorization header.
   - Result: Status 401 `{ success: false, message: "Unauthorized", errorDetails: "No token provided" }`.

## [2026-08-23] - Bookings Module: Technician Status Transitions (`PATCH /api/technician/bookings/:id`)

### Files Created & Refactored
- **`src/modules/bookings/validation.ts`**:
  - Added `updateBookingStatusSchema`: Validates `status` is required and restricted strictly to `["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"]`. Rejects `REQUESTED`, `PAID`, `CANCELLED`, or arbitrary string values.
- **`src/modules/bookings/service.ts`**:
  - Added `updateBookingStatus`: Fetches booking with `technicianProfile`. Throws `AppError(404, "Booking not found")` if missing. Verifies caller's `userId` matches `technicianProfile.userId` (throws `AppError(403, "You can only manage your own bookings")` if unauthorized). Enforces strict status transition state machine:
    - `REQUESTED` → `ACCEPTED` | `DECLINED`
    - `ACCEPTED` → `IN_PROGRESS`
    - `IN_PROGRESS` → `COMPLETED`
    - Any invalid transition (or terminal `COMPLETED` / `DECLINED` state) throws `AppError(400, "Invalid status transition from X to Y")`.
- **`src/modules/bookings/controller.ts`**: Added `updateBookingStatus` (200) handler wrapped in `asyncHandler`.
- **`src/modules/bookings/route.ts`**: Created and exported `technicianBookingRouter` with `PATCH /:id` route protected by `authenticate` + `authorize('TECHNICIAN')` and `validateRequest(updateBookingStatusSchema)`.
- **`src/routes/index.ts`**: Mounted `technicianBookingRouter` under `/technician/bookings` (`PATCH /api/technician/bookings/:id`).

### Verification Results
1. **REQUESTED → ACCEPTED Transition**: Correct technician called `PATCH /api/technician/bookings/:id` with `status: "ACCEPTED"`.
   - Result: Status 200 `{ success: true, message: "Booking status updated successfully", data: { id, status: "ACCEPTED", ... } }`.
2. **ACCEPTED → ACCEPTED Repeat Transition Rejection**: Technician re-sent `status: "ACCEPTED"`.
   - Result: Status 400 `{ success: false, message: "Invalid status transition from ACCEPTED to ACCEPTED", errorDetails: "..." }`.
3. **ACCEPTED → IN_PROGRESS Transition**: Technician sent `status: "IN_PROGRESS"`.
   - Result: Status 200 `{ success: true, message: "Booking status updated successfully", data: { id, status: "IN_PROGRESS", ... } }`.
4. **IN_PROGRESS → COMPLETED Transition**: Technician sent `status: "COMPLETED"`.
   - Result: Status 200 `{ success: true, message: "Booking status updated successfully", data: { id, status: "COMPLETED", ... } }`.
5. **Terminal COMPLETED State Modification Rejection**: Technician attempted sending `status: "IN_PROGRESS"` on completed booking.
   - Result: Status 400 `{ success: false, message: "Invalid status transition from COMPLETED to IN_PROGRESS", errorDetails: "..." }`.
6. **REQUESTED → DECLINED Transition & Terminal DECLINED Rejection**: Fresh booking transitioned `REQUESTED` → `DECLINED` (Status 200). Subsequent attempt `DECLINED` → `ACCEPTED` failed with Status 400 (`Invalid status transition from DECLINED to ACCEPTED`).
7. **Unassigned Technician Ownership Denial**: Unassigned Technician 2 attempted `PATCH` on Technician 1's booking.
   - Result: Status 403 `{ success: false, message: "You can only manage your own bookings", errorDetails: "..." }`.
8. **Customer Role Restriction**: Customer token attempted `PATCH /api/technician/bookings/:id`.
   - Result: Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
9. **Invalid Status Input Validation**: Attempted `status: "REQUESTED"` and `status: "banana"`.
   - Result: Status 400 `{ success: false, message: "Validation Error", errorDetails: "status: Invalid status. Allowed statuses are ACCEPTED, DECLINED, IN_PROGRESS, COMPLETED" }`.

## [2026-08-24] - Stripe SDK & Configuration Layer Setup

### Packages Installed
- **Dependencies**: `stripe` (v22.5.0)

### Files Created & Refactored
- **`src/config/env.ts`**: Updated environment variable loader to perform fail-fast startup validation for `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` when `NODE_ENV !== 'test'`.
- **`src/config/stripe.ts`**: Created singleton `Stripe` client instance configured with `config.stripe.secretKey` and explicitly pinned `apiVersion: "2026-07-29.dahlia"`.

### Verification Results
1. **Compilation & Build**: Executed `npm run format ; npm run lint ; npm run build`. Clean build succeeded with 0 errors and 0 lint warnings.
2. **Fail-Fast Startup Validation**: Temporarily removed `STRIPE_SECRET_KEY` from `.env` and executed `src/config/env.ts`.
   - Result: App failed fast at startup with clear exception: `Error: Missing required environment variable(s): STRIPE_SECRET_KEY`. Restored `.env` immediately.
3. **Stripe API Connectivity Check**: Executed `stripe.balance.retrieve()` call using the singleton client instance.
   - Result: Returned successfully with `object: "balance"`, `livemode: false`, and `available: [{ currency: "usd" }]`.

## [2026-08-24] - Payments Module: Stripe PaymentIntent Creation (`POST /api/payments/create`)

### Database Changes
- **`prisma/schema.prisma`**:
  - Added `PaymentStatus` enum (`PENDING`, `COMPLETED`, `FAILED`).
  - Added `Payment` model (`id`, `bookingId` unique relation to `Booking`, `transactionId` unique Stripe PaymentIntent ID, `amount` Decimal, `method` default `"card"`, `provider` default `"stripe"`, `status` default `PENDING`, `paidAt` optional DateTime, `createdAt`, `updatedAt`).
  - Added inverse `payment Payment?` relation to `Booking`.
- Applied migration `20260823185451_add_payment_model` to remote Postgres database and regenerated Prisma Client.

### Files Created & Refactored
- **`src/modules/payments/validation.ts`**: `createPaymentIntentSchema` validating required UUID `bookingId`.
- **`src/modules/payments/service.ts`**:
  - `createPaymentIntent`: Fetches target booking. Throws `AppError(404, "Booking not found")` if missing. Verifies `booking.customerId === customerId` (`AppError(403, "You can only pay for your own bookings")`). Enforces `booking.status === "ACCEPTED"` (`AppError(400, "Only accepted bookings can be paid for. Current status: <status>")`).
  - **Duplicate/Retry PaymentIntent Approach**: If a `Payment` row exists with `status: "COMPLETED"`, throws `AppError(400, "This booking has already been paid for")`. If a `Payment` row exists with `status: "PENDING"`, creates a new Stripe PaymentIntent and updates the existing `Payment` row's `transactionId` and `amount` in-place (maintaining 1 `Payment` row per booking without duplicate DB records).
  - Creates Stripe PaymentIntent via SDK (`stripe.paymentIntents.create`) with `amount` in cents, currency `"usd"`, and `metadata: { bookingId, customerId }`. Returns `{ clientSecret, payment }`.
- **`src/modules/payments/controller.ts`**: Express handler `createPaymentIntent` (201) wrapped in `asyncHandler`.
- **`src/modules/payments/route.ts`**: Mounted `POST /create` protected by `authenticate` + `authorize('CUSTOMER')` and `validateRequest(createPaymentIntentSchema)`.
- **`src/routes/index.ts`**: Mounted `paymentRoutes` under `/payments` (`POST /api/payments/create`).

### Verification Results
1. **Valid PaymentIntent Creation for ACCEPTED Booking**: Customer called `POST /api/payments/create` for an `ACCEPTED` booking.
   - Result: Status 201 `{ success: true, message: "Payment intent created successfully", data: { clientSecret: "pi_..._secret_...", payment: { status: "PENDING", transactionId: "pi_...", amount: "250" } } }`. Payment row created in DB with `status: PENDING`.
2. **Duplicate/Retry PENDING PaymentIntent**: Customer re-sent `POST /api/payments/create` for the same pending booking.
   - Result: Status 201 returning a fresh `clientSecret`. Confirmed in DB that `Payment` row count for `bookingId` remains exactly 1 (row updated in place with new `transactionId`).
3. **REQUESTED Booking Payment Rejection**: Customer attempted payment for a `REQUESTED` booking.
   - Result: Status 400 `{ success: false, message: "Only accepted bookings can be paid for. Current status: REQUESTED", errorDetails: "..." }`.
4. **DECLINED Booking Payment Rejection**: Customer attempted payment for a `DECLINED` booking.
   - Result: Status 400 `{ success: false, message: "Only accepted bookings can be paid for. Current status: DECLINED", errorDetails: "..." }`.
5. **Unrelated Customer Access Denial**: Unrelated Customer 2 attempted payment for Customer 1's booking.
   - Result: Status 403 `{ success: false, message: "You can only pay for your own bookings", errorDetails: "..." }`.
6. **Nonexistent Booking ID Handling**: Customer sent `bookingId: "00000000-0000-0000-0000-000000000000"`.
   - Result: Status 404 `{ success: false, message: "Booking not found", errorDetails: "Booking not found" }`.
7. **Role Access Restrictions (Technician & Admin)**: Attempted request using TECHNICIAN and ADMIN tokens.
   - Result: Both returned Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
8. **Stripe API Verification**: Retrieved PaymentIntent via Stripe SDK using `stripe.paymentIntents.retrieve(paymentIntentId)`.
   - Result: Confirmed PaymentIntent exists on Stripe's servers with `amount: 25000` (cents = $250.00), `currency: "usd"`, and `metadata: { bookingId, customerId }`.

## [2026-08-24] - Payments Module: Webhook Handler & Payment Status Auto-Confirmation

### Files Created & Refactored
- **`src/app.ts`**: Mounted `express.raw({ type: "application/json" })` specifically for `/api/payments/confirm` before `express.json()` to preserve unparsed `Buffer` request payloads required for Stripe webhook signature verification. Also attached `rawBody` property in `express.json({ verify })` fallback.
- **`src/modules/payments/service.ts`**:
  - `handleWebhookEvent(rawBody, signature)`: Verifies Stripe webhook signature using `stripe.webhooks.constructEvent(rawBody, signature, config.stripe.webhookSecret)`. Throws `AppError(400, "Webhook signature verification failed")` on signature mismatch or tampered payload.
  - **`payment_intent.succeeded` Handling**: Extracts `PaymentIntent` ID (`transactionId`), finds `Payment` record, and performs a Prisma `$transaction` updating `Payment.status = "COMPLETED"`, `Payment.paidAt = new Date()`, and `Booking.status = "PAID"`.
  - **`payment_intent.payment_failed` Handling**: Updates `Payment.status = "FAILED"` without altering `Booking.status` (leaving it `ACCEPTED` so customer can retry).
  - `getMyPayments(userId, role)`: Lists caller's payments if `role === "CUSTOMER"`.
  - `getPaymentById(userId, role, paymentId)`: Fetches payment record with ownership verification (`payment.booking.customerId === userId`).
- **`src/modules/payments/controller.ts`**: Handlers `confirmWebhook`, `getMyPayments`, and `getPaymentById` wrapped in `asyncHandler`.
- **`src/modules/payments/route.ts`**: Mounted `POST /confirm` (public webhook, signature verified), `GET /` (`authenticate`, `authorize('CUSTOMER')`), and `GET /:id` (`authenticate`, `authorize('CUSTOMER')`).

### Verification Results
1. **Successful Payment Confirmation & Webhook Processing**: Confirmed `PaymentIntent` (`pi_...`) via Stripe SDK with `pm_card_visa` and sent signed `payment_intent.succeeded` webhook to `POST /api/payments/confirm`.
   - Result: Webhook returned HTTP 200 `{ success: true, message: "Webhook processed successfully", data: { received: true } }`.
2. **GET Payment Record Verification**: Called `GET /api/payments/:id` as the paying customer.
   - Result: Status 200 returning payment record with `status: "COMPLETED"` and `paidAt` timestamp set.
3. **Auto-Updated Booking Status Verification**: Called `GET /api/bookings/:id` for the paid booking.
   - Result: Status 200 returning booking with `status: "PAID"` (auto-updated by database transaction).
4. **Invalid Signature Verification Failure**: Sent webhook request to `POST /api/payments/confirm` with a tampered `stripe-signature` header.
   - Result: Returned HTTP 400 `{ success: false, message: "Webhook signature verification failed", errorDetails: "..." }`. No database modifications occurred.
5. **Payment Failure Webhook Handling**: Sent signed `payment_intent.payment_failed` event.
   - Result: Returned HTTP 200. `Payment.status` updated to `FAILED`, while `Booking.status` remained `ACCEPTED`.
6. **Customer Payment Listing (`GET /api/payments`)**: Called `GET /api/payments` as paying customer.
   - Result: Status 200 returning list of customer's payments including `COMPLETED` and `PENDING` records.
7. **Cross-Customer Isolation**: Called `GET /api/payments` as a different customer.
   - Result: Status 200 returning `data: []` (no leakage of Customer 1's payment records).

## [2026-08-24] - Payments Module: Enriched Payment History & Detail Endpoints with Role-Based Access

### Files Created & Refactored
- **`src/modules/payments/service.ts`**:
  - `getMyPayments(userId, role)`: Refactored with role-based branching:
    - **CUSTOMER**: Returns payment records linked to their bookings, enriched with `scheduledDate`, `serviceTitle`, and `technicianName`.
    - **TECHNICIAN**: Returns payment records linked to bookings on their `TechnicianProfile`, enriched with `scheduledDate`, `serviceTitle`, and `customerName`.
    - **ADMIN**: Throws `AppError(403, "Forbidden", "Full admin payment listing is available in the admin dashboard")` to defer full listing to Prompt 22.
  - `getPaymentById(userId, role, paymentId)`: Enriched with booking/service/user context and role-scoped ownership checks:
    - **CUSTOMER**: Verifies `payment.booking.customerId === userId` (throws 403 on mismatch).
    - **TECHNICIAN**: Verifies `payment.booking.technicianProfile.userId === userId` (throws 403 on mismatch).
    - **ADMIN**: Granted full read-only access to view any payment by ID.
    - Throws `AppError(404, "Payment not found")` if ID does not exist.
- **`src/modules/payments/route.ts`**:
  - Updated `GET /` and `GET /:id` to use `authorize('CUSTOMER', 'TECHNICIAN', 'ADMIN')`.

### Role-Branching Architecture Decision
- For `GET /api/payments` (the list endpoint):
  - **CUSTOMER**: Sees payments for their booked services.
  - **TECHNICIAN**: Sees payments for completed/accepted jobs on their services (consistent with Bookings module role-branching pattern).
  - **ADMIN**: Restricted with HTTP 403, delegating global admin payment listing to Prompt 22.
- For `GET /api/payments/:id` (by-ID endpoint):
  - **ADMIN**: Allowed full read-only access ahead of Prompt 22 for single payment lookup.

### Verification Results
1. **Enriched Customer Payment Listing**: Called `GET /api/payments` as CUSTOMER.
   - Result: Status 200 returning list items with `serviceTitle: "Solar Panel Maintenance"`, `scheduledDate`, `technicianName: "Enriched Tech 1"`.
2. **Enriched Technician Payment Listing**: Called `GET /api/payments` as TECHNICIAN.
   - Result: Status 200 returning list items with `serviceTitle: "Solar Panel Maintenance"`, `scheduledDate`, `customerName: "Enriched Cust 1"`.
3. **Admin Payment Listing Restriction**: Called `GET /api/payments` as ADMIN.
   - Result: Status 403 `{ success: false, message: "Forbidden", errorDetails: "Full admin payment listing is available in the admin dashboard" }`.
4. **Admin Single Payment Access**: Called `GET /api/payments/:id` as ADMIN with valid payment ID.
   - Result: Status 200 returning full enriched payment details.
5. **Assigned Technician Payment Detail Access**: Called `GET /api/payments/:id` as assigned TECHNICIAN.
   - Result: Status 200 returning full enriched payment details.
6. **Unrelated Technician Access Denial**: Called `GET /api/payments/:id` as an unrelated TECHNICIAN.
   - Result: Status 403 `{ success: false, message: "You do not have permission to view this payment", errorDetails: "..." }`.
7. **Unrelated Customer Access Denial**: Called `GET /api/payments/:id` as an unrelated CUSTOMER.
   - Result: Status 403 `{ success: false, message: "You do not have permission to view this payment", errorDetails: "..." }`.
8. **Nonexistent Payment ID Lookup**: Called `GET /api/payments/00000000-0000-0000-0000-000000000000`.
   - Result: Status 404 `{ success: false, message: "Payment not found", errorDetails: "Payment not found" }`.

## [2026-08-24] - Reviews Module: Ratings, Review Creation & Technician Profile Aggregation

### Database Changes
- **`prisma/schema.prisma`**:
  - Added `Review` model (`id`, `bookingId` unique relation to `Booking`, `customerId` relation to `User`, `technicianProfileId` relation to `TechnicianProfile`, `rating` int 1-5, `comment` optional string, `createdAt`).
  - Added inverse relations: `review Review?` on `Booking`, `reviews Review[]` on `User` and `TechnicianProfile`.
- Applied migration `20260823190912_add_review_model` to remote Postgres database and regenerated Prisma Client.

### Files Created & Refactored
- **`src/modules/reviews/validation.ts`**: `createReviewSchema` validating required UUID `bookingId`, `rating` (int min 1 max 5), and optional `comment` (max 1000 chars).
- **`src/modules/reviews/service.ts`**:
  - `createReview(customerId, data)`: Fetches booking. Verifies `booking.customerId === customerId` (`AppError(403)`), `booking.status === "COMPLETED"` (`AppError(400)`), and `!booking.review` (`AppError(400)`).
  - Executed inside a Prisma `$transaction`: Creates the `Review` row, calculates `_avg` rating and `_count` total reviews for `technicianProfileId` using Prisma `aggregate`, and updates `TechnicianProfile.avgRating` & `TechnicianProfile.totalReviews`.
  - `getTechnicianReviews(technicianProfileId)`: Public function returning customer name, rating, comment, and createdAt for a technician profile, ordered by `createdAt` descending.
- **`src/modules/reviews/controller.ts`**: Handlers `createReview` (201) and `getTechnicianReviews` (200) wrapped in `asyncHandler`.
- **`src/modules/reviews/route.ts`**: Mounted `POST /` (`authenticate` + `authorize('CUSTOMER')`).
- **`src/modules/catalog/service.ts`**: Updated `getTechnicianById` to import `getTechnicianReviews` from `src/modules/reviews/service.ts` and dynamically populate the `reviews` array (replacing the previous `reviews: []` placeholder).
- **`src/routes/index.ts`**: Mounted `reviewRoutes` under `/reviews` (`POST /api/reviews`).

### Cross-Module Import Decision
- Imported `getTechnicianReviews` from `src/modules/reviews/service.ts` directly into `src/modules/catalog/service.ts`. Since `reviews/service.ts` does not depend on or import `catalog/service.ts`, this maintains a clean, one-way dependency graph without circular import warnings or runtime errors.

### Verification Results
1. **Valid Review Creation for COMPLETED Booking**: Customer called `POST /api/reviews` (`bookingId: "<completedId>", rating: 5, comment: "Great work"`).
   - Result: Status 201 `{ success: true, message: "Review created successfully", data: { id, rating: 5, comment: "Great work", ... } }`.
2. **Populated Public Technician Profile & Rating Aggregation**: Called `GET /api/technicians/:id`.
   - Result: Status 200 returning `avgRating: 5`, `totalReviews: 1`, and `reviews` array containing the newly submitted review object.
3. **Duplicate Review Prevention**: Re-sent `POST /api/reviews` for the same booking.
   - Result: Status 400 `{ success: false, message: "You have already reviewed this booking", errorDetails: "..." }`.
4. **Non-COMPLETED Booking Review Rejection**: Customer attempted review on an `ACCEPTED` booking.
   - Result: Status 400 `{ success: false, message: "You can only review completed bookings", errorDetails: "..." }`.
5. **Unrelated Customer Access Denial**: Customer 2 attempted to review Customer 1's booking.
   - Result: Status 403 `{ success: false, message: "You can only review your own bookings", errorDetails: "..." }`.
6. **Rating Out-of-Range Validation**: Sent `rating: 6` and `rating: 0`.
   - Result: Both returned Status 400 validation error (`rating: Rating cannot exceed 5` / `rating: Rating must be at least 1`).
7. **Multiple Rating Recalculation**: Submitted a second review (`rating: 3`) for the same technician.
   - Result: Status 201. `GET /api/technicians/:id` confirmed `avgRating: 4` (average of 5 and 3) and `totalReviews: 2`.
8. **Role Access Restrictions (Technician & Admin)**: Attempted review submission using TECHNICIAN and ADMIN tokens.
   - Result: Both returned Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.

## [2026-08-24] - Admin Module: User Management & Platform-Wide Visibility

### Files Created & Refactored
- **`src/modules/admin/validation.ts`**:
  - `updateUserStatusSchema`: Validates required `status` ("ACTIVE" | "BANNED").
  - Query validation schemas for `adminUsersQuerySchema` (optional `role`, `status`, `page`, `limit`), `adminBookingsQuerySchema` (optional `status`, `page`, `limit`), and `adminPaymentsQuerySchema` (optional `status`, `page`, `limit`).
- **`src/modules/admin/service.ts`**:
  - `getAllUsers(filters)`: Returns paginated user records stripped of password.
  - `updateUserStatus(targetUserId, newStatus)`: Updates user status. Throws `AppError(400, "Cannot change status of an admin account")` if target user is an ADMIN.
  - `getAllBookings(filters)`: Platform-wide view of all bookings (deferred from Prompt 15). Enriched with `customerName`, `technicianName`, and `serviceTitle`.
  - `getAllPayments(filters)`: Platform-wide view of all payments (deferred from Prompt 20). Enriched with `customerName`, `technicianName`, `serviceTitle`, and `scheduledDate`.
  - `getAllCategories()`: Calls `getAllCategories()` from `src/modules/categories/service.ts` to reuse domain logic.
- **`src/modules/admin/controller.ts`**: Handlers `getAllUsers`, `updateUserStatus`, `getAllBookings`, `getAllPayments`, and `getAllCategories` wrapped in `asyncHandler`.
- **`src/modules/admin/route.ts`**: Extended existing router with `router.use(authenticate, authorize("ADMIN"))` protecting:
  - `GET /api/admin/users`
  - `PATCH /api/admin/users/:id`
  - `GET /api/admin/bookings`
  - `GET /api/admin/payments`
  - `GET /api/admin/categories`
  - `POST /api/admin/categories` (retained from Prompt 9).

### Categories Reuse Decision
- Reused `getAllCategories()` directly from `src/modules/categories/service.ts` inside `src/modules/admin/service.ts`. This avoids code duplication while allowing `GET /api/admin/categories` to return category data formatted consistently across the system.

### Verification Results
1. **Admin User Listing & Password Excluded**: Called `GET /api/admin/users` as ADMIN.
   - Result: Status 200 returning list of all users. Confirmed `password` field is not present in any record.
2. **User Role Filtering**: Called `GET /api/admin/users?role=TECHNICIAN`.
   - Result: Status 200 returning only technician accounts.
3. **User Status Banning**: Called `PATCH /api/admin/users/:id` with `{ status: "BANNED" }` on Customer 1.
   - Result: Status 200 returning updated user record with `status: "BANNED"`.
4. **Banned User Login Rejection**: Attempted `POST /api/auth/login` as the banned Customer 1.
   - Result: Status 400 `{ success: false, message: "Account has been suspended", errorDetails: "Account has been suspended" }`.
5. **Admin Self/Peer Ban Safety Guard**: Attempted `PATCH /api/admin/users/:id` with `{ status: "BANNED" }` targeting an ADMIN account.
   - Result: Status 400 `{ success: false, message: "Cannot change status of an admin account", errorDetails: "..." }`.
6. **Platform-Wide Bookings Visibility**: Called `GET /api/admin/bookings` as ADMIN.
   - Result: Status 200 returning all 17 platform-wide bookings across all users.
7. **Platform-Wide Payments Visibility**: Called `GET /api/admin/payments` as ADMIN.
   - Result: Status 200 returning all 8 platform-wide payments across all users.
8. **Admin Categories Listing**: Called `GET /api/admin/categories` as ADMIN.
   - Result: Status 200 returning list of categories.
9. **Role Restriction Enforcement**: Called `/api/admin/users` using CUSTOMER and TECHNICIAN tokens.
   - Result: Both returned Status 403 `{ success: false, message: "Forbidden", errorDetails: "You do not have permission to access this resource" }`.
10. **Unauthenticated Denial**: Called `/api/admin/users` with no token header.
    - Result: Status 401 `{ success: false, message: "Unauthorized", errorDetails: "No token provided" }`.
