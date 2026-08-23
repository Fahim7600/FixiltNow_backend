# FixItNow - Backend API

FixItNow is a backend-only home services marketplace API built with Node.js, Express, TypeScript, Prisma ORM, and JWT authentication.

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
  /modules        <- Feature modules (auth, users, services, bookings, payments, reviews, categories)
  /middlewares    <- Shared Express middlewares (error handlers, auth guards, etc.)
  /config         <- Application configuration and environment variable loading
  /utils          <- Shared utility helper functions
  /routes         <- Central route aggregator (index.ts)
  app.ts          <- Express app configuration and middleware chain
  server.ts       <- Server entry point
```

## Available Scripts

- `npm run dev`: Runs the application in development mode with live reload (`ts-node-dev`)
- `npm run build`: Compiles TypeScript to JavaScript in the `dist/` directory
- `npm start`: Runs the production build (`node dist/server.js`)
- `npm run lint`: Runs ESLint code quality checks
