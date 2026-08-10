import express from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";

import User from "../models/User.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { issueCsrf } from "../middleware/csrf.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";
import { clearSessionCookie, publicUser, setSessionCookie } from "../utils/auth.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts. Try again later." }
});

router.get("/csrf", (req, res) => {
  const csrfToken = issueCsrf(req, res);
  res.json({ success: true, csrfToken });
});

router.post("/register", authLimiter, validate(registerSchema), async (req, res) => {
  const { name, email, password, role } = req.validated;

  if (await User.exists({ email })) {
    return res.status(409).json({ success: false, message: "An account already exists with this email." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    lastLoginAt: new Date()
  });

  setSessionCookie(res, user._id);

  return res.status(201).json({
    success: true,
    message: "Account created successfully.",
    user: publicUser(user)
  });
});

router.post("/login", authLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.validated;
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  if (user.accountStatus !== "active") {
    return res.status(403).json({ success: false, message: "This account is not active." });
  }

  user.lastLoginAt = new Date();
  await user.save();

  setSessionCookie(res, user._id);

  return res.json({
    success: true,
    message: "Signed in successfully.",
    user: publicUser(user)
  });
});

router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  return res.json({ success: true, message: "Signed out." });
});

router.get("/me", requireAuth, (req, res) => {
  return res.json({ success: true, user: publicUser(req.user) });
});

export default router;
