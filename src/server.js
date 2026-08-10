import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { env, validateEnv } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { requireCsrf } from "./middleware/csrf.js";
import { rejectMongoOperators } from "./middleware/security.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import proposalRoutes from "./routes/proposals.routes.js";
import contractRoutes from "./routes/contracts.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import adminRoutes from "./routes/admin.routes.js";

validateEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", env.trustProxy);

app.use(
  helmet({
    contentSecurityPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })
);

app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: false, limit: "300kb" }));
app.use(cookieParser());

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Try again later." }
  })
);

app.use("/api", rejectMongoOperators);
app.use("/api", requireCsrf);

app.get("/api/health", (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;

  return res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    service: "workiffy-marketplace",
    database: databaseReady ? "connected" : "disconnected",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/config/public", (_req, res) => {
  return res.json({
    success: true,
    config: {
      supportEmail: env.supportEmail,
      subscriptionsEnforced: env.enforceSubscriptions
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api", (_req, res) => {
  return res.status(404).json({ success: false, message: "API endpoint not found." });
});

app.use(
  express.static(publicDir, {
    index: false,
    maxAge: env.nodeEnv === "production" ? "1h" : 0,
    etag: true
  })
);

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.set("Cache-Control", "no-cache");
    return res.sendFile(path.join(publicDir, "index.html"));
  }
  next();
});

app.use((error, req, res, _next) => {
  console.error("[Unhandled Error]", error);

  if (req.path.startsWith("/api")) {
    return res.status(error.status || 500).json({
      success: false,
      message:
        env.nodeEnv === "production"
          ? "An internal server error occurred."
          : error.message || "An internal server error occurred."
    });
  }

  return res.status(500).send("Application error.");
});

if (process.env.VERCEL !== "1") {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`[Workiffy] listening on port ${env.port}`);
    console.log(`[Workiffy] ${env.appOrigin}`);
  });

  async function shutdown(signal) {
    console.log(`[Workiffy] ${signal} received. Shutting down.`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 10000).unref();
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

export default app;
