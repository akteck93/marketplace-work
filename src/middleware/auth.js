import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.workiffy_session;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select(
      "_id name email role accountStatus profile subscription rating completedContracts savedProviders savedProjects"
    );

    if (!user || user.accountStatus !== "active") {
      return res.status(401).json({ success: false, message: "Account is unavailable." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired session." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Permission denied." });
    }
    next();
  };
}

export function hasActiveSubscription(user) {
  if (!env.enforceSubscriptions || user?.role === "admin") return true;

  const sub = user?.subscription;
  const planMatchesRole =
    user?.role === "client"
      ? ["client", "business"].includes(sub?.plan)
      : user?.role === "provider"
        ? ["provider", "business"].includes(sub?.plan)
        : true;

  return (
    sub?.status === "active" &&
    (!sub.expiresAt || new Date(sub.expiresAt).getTime() > Date.now()) &&
    planMatchesRole
  );
}

export function requireSubscription(req, res, next) {
  if (hasActiveSubscription(req.user)) return next();

  return res.status(402).json({
    success: false,
    message: "An active Workiffy subscription is required for this action."
  });
}
