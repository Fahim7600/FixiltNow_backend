import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import routes from "./routes";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Mounting
app.use("/api", routes);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("FixItNow Backend API is running.");
});

export default app;
