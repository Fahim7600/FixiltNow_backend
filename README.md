# FixItNow - On-Demand Home Services Marketplace Backend API

FixItNow is a robust, production-ready RESTful API backend for an on-demand home services marketplace platform connecting customers with skilled technicians. Built with Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, and Stripe integration.

## Tech Stack

- **Runtime & Language**: Node.js, TypeScript (strict mode)
- **Framework**: Express.js (v5)
- **Database & ORM**: PostgreSQL, Prisma ORM (v7) with `@prisma/adapter-pg`
- **Authentication**: JWT (`jsonwebtoken`) with `bcrypt` password hashing (10 rounds)
- **Validation & Sanitization**: Zod
- **Security & Hardening**: `helmet`, `cors`, `express-rate-limit`
- **Logging & Monitoring**: `morgan` HTTP request logger
- **Payments**: Stripe Node SDK (`stripe`) with webhook verification
- **API Documentation**: OpenAPI 3.0 via `swagger-jsdoc` and `swagger-ui-express` served at `/api-docs`
- **Toolchain**: Biome (formatting and linting)

---

## Working Admin Credentials

For testing and grading verification, the database seed script provisions a working admin account:

- **Email**: `admin@fixitnow.com`
- **Password**: `Admin@12345`
- **Role**: `ADMIN`

---

## Setup & Installation Instructions

Follow these steps to run the backend locally:

### 1. Clone the repository
```bash
git clone https://github.com/Fahim7600/FixiltNow_backend.git
cd FixiltNow_backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
Copy the sample environment file and populate the necessary values:
```bash
cp .env.example .env
```

Ensure `.env` contains valid values for:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/fixitnow_db?schema=public"
CORS_ORIGIN="*"
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Database migrations & Prisma client generation
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed the database
Provision the admin account and baseline service categories ("Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry"):
```bash
npx prisma db seed
```

### 6. Start the server
Run in development mode with live reload:
```bash
npm run dev
```

---

## Interactive API Documentation

Access the full OpenAPI / Swagger documentation UI at:

- **Swagger UI**: `http://localhost:5000/api-docs`

---

## Architecture & Modular Convention

All feature modules live under `/src/modules/<name>` following a consistent architecture:

- `controller.ts` — Handles HTTP requests and responses
- `service.ts` — Implements core business logic and database access
- `route.ts` — Defines routes and mounts module controllers/middlewares
- `validation.ts` — Contains Zod request validation schemas

### Project Directory Layout

```text
/src
  /modules        <- Feature modules (auth, admin, availability, bookings, catalog, categories, payments, reviews, services, technicianProfile)
  /middlewares    <- Shared Express middlewares (errorHandler, notFoundHandler, authGuard, rateLimiter, validateRequest)
  /config         <- Application configuration, Prisma client, Stripe SDK, and Swagger setup
  /utils          <- Shared utility helper functions (AppError, asyncHandler)
  /routes         <- Central route aggregator (index.ts)
  app.ts          <- Express app setup and middleware chain
  server.ts       <- Entry point starting HTTP server
prisma/
  schema.prisma   <- Prisma database schema definitions
  seed.ts         <- Database seed script for admin and categories
```

---

## Available Scripts

- `npm run dev`: Runs dev server with live reload (`ts-node-dev`)
- `npm run build`: Compiles TypeScript to `dist/`
- `npm start`: Executes production build (`node dist/server.js`)
- `npm run lint`: Runs Biome linter check
- `npm run format`: Runs Biome code formatter
- `npx prisma db seed`: Executes database seed script

---

## Deployment (Render)

This repository includes a pre-configured `render.yaml` for zero-config deployment on Render:

- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: Configure `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` in the Render Dashboard.
