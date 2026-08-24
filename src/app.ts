import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { apiLimiter } from "./middlewares/rateLimiter";
import routes from "./routes";

const app: Application = express();

// Enable Trust Proxy (reads X-Forwarded-For header from reverse proxies / Next.js)
app.set("trust proxy", 1);

// Security Headers (helmet)
app.use(helmet());

// CORS Configuration
const allowedOrigins =
  config.corsOrigin === "*"
    ? "*"
    : config.corsOrigin.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Request Logging (morgan)
if (config.env === "development") {
  app.use(morgan("dev"));
} else if (config.env !== "test") {
  app.use(morgan("combined"));
}

// Raw body parser specifically for Stripe webhook endpoint to preserve Buffer signature validation
app.use("/api/payments/confirm", express.raw({ type: "application/json" }));

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as unknown as { rawBody?: Buffer }).rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation (Public)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global API Rate Limiter applied to all /api routes
app.use("/api", apiLimiter);

// Route Mounting
app.use("/api", routes);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("FixItNow Backend API is running.");
});

// Not Found Handler (mounted after all routes)
app.use(notFoundHandler);

// Global Error Handler (must be the LAST middleware registered)
app.use(errorHandler);

export default app;
