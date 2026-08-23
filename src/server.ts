import app from "./app";
import { config } from "./config/env";

const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port} in ${config.env} mode`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
