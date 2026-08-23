import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const env = process.env.NODE_ENV || "development";

if (env !== "test") {
  const missingVars: string[] = [];

  if (!process.env.STRIPE_SECRET_KEY) {
    missingVars.push("STRIPE_SECRET_KEY");
  }
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    missingVars.push("STRIPE_PUBLISHABLE_KEY");
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    missingVars.push("STRIPE_WEBHOOK_SECRET");
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missingVars.join(", ")}`,
    );
  }
}

export const config = {
  env,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwt: {
    secret: process.env.JWT_SECRET || "default_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },
};
