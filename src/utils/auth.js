import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function setSessionCookie(res, userId) {
  const token = jwt.sign({ sub: String(userId) }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  res.cookie("workiffy_session", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    domain: env.cookieDomain,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function clearSessionCookie(res) {
  res.clearCookie("workiffy_session", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    domain: env.cookieDomain,
    path: "/"
  });
}

export function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus,
    profile: user.profile,
    subscription: user.subscription,
    rating: user.rating,
    completedContracts: user.completedContracts
  };
}
