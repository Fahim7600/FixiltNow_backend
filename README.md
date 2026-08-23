# FixItNow - Backend API

FixItNow is a backend-only home services marketplace API built with Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, and JWT authentication.

## Working Admin Credentials

For testing and grading verification, the database seed script provisions a working admin account:

- **Email**: `admin@fixitnow.com`
- **Password**: `Admin@12345`
- **Role**: `ADMIN`

## Database Seeding

To provision the admin account and baseline service categories ("Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry"), run:

```bash
npx prisma db seed
```

## API Documentation

Interactive Swagger/OpenAPI documentation is available at:

- **Swagger UI**: `http://localhost:5000/api-docs`

## Architecture & Modular Convention

All feature modules are placed under `/src/modules/<name>` and follow a consistent pattern.

Each module folder contains:
- `controller.ts` — Handles HTTP requests and responses
- `service.ts` — Implements core business logic and database access
- `route.ts` — Defines routes and mounts module controllers/middlewares
- `validation.ts` — Contains request data validation logic

### Project Structure Overview

```text
/src
  /modules        <- Feature modules (auth, admin, availability, bookings, catalog, categories, payments, reviews, services, technicianProfile)
  /middlewares    <- Shared Express middlewares (errorHandler, notFoundHandler, authGuard, rateLimiter, validateRequest)
  /config         <- Application configuration, Prisma client, Stripe SDK, and Swagger setup
  /utils          <- Shared utility helper functions (AppError, asyncHandler)
  /routes         <- Central route aggregator (index.ts)
  app.ts          <- Express app configuration and middleware chain
  server.ts       <- Server entry point
```

## Available Scripts

- `npm run dev`: Runs the application in development mode with live reload (`ts-node-dev`)
- `npm run build`: Compiles TypeScript to JavaScript in the `dist/` directory
- `npm start`: Runs the production build (`node dist/server.js`)
- `npm run lint`: Runs Biome check for linting
- `npm run format`: Runs Biome formatting
- `npx prisma db seed`: Runs database seed script (`prisma/seed.ts`)
