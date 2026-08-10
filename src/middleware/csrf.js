import crypto from "node:crypto";
import { env } from "../config/env.js";

const COOKIE = "workiffy_csrf";

function cookieOptions() {
  return {
    httpOnly: false,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    domain: env.cookieDomain,
    path: "/",
    maxAge: 12 * 60 * 60 * 1000
  };
}

export function issueCsrf(req, res) {
  const token = req.cookies[COOKIE] || crypto.randomBytes(32).toString("hex");
  res.cookie(COOKIE, token, cookieOptions());
  return token;
}

export function requireCsrf(req, res, next) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();

  const origin = req.get("origin");
  if (origin && origin !== env.appOrigin) {
    return res.status(403).json({ success: false, message: "Request origin is not allowed." });
  }

  const cookieToken = req.cookies[COOKIE];
  const headerToken = req.get("x-csrf-token");

  if (!cookieToken || !headerToken) {
    return res.status(403).json({ success: false, message: "CSRF token missing." });
  }

  const a = Buffer.from(cookieToken);
  const b = Buffer.from(headerToken);

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(403).json({ success: false, message: "Invalid CSRF token." });
  }

  next();
}
