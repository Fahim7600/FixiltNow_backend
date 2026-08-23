import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import routes from "./routes";

const app: Application = express();

// Middlewares
app.use(cors());

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
