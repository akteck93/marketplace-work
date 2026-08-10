import express from "express";
import mongoose from "mongoose";

import User from "../models/User.js";
import Project from "../models/Project.js";
import Proposal from "../models/Proposal.js";
import Contract from "../models/Contract.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { userStatusSchema, adminSubscriptionSchema } from "../validators/schemas.js";

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/metrics", async (_req, res) => {
  const [
    users,
    clients,
    providers,
    openProjects,
    proposals,
    activeContracts,
    completedContracts
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "client" }),
    User.countDocuments({ role: "provider" }),
    Project.countDocuments({ status: "open" }),
    Proposal.countDocuments(),
    Contract.countDocuments({ status: "active" }),
    Contract.countDocuments({ status: "completed" })
  ]);

  return res.json({
    success: true,
    metrics: {
      users,
      clients,
      providers,
      openProjects,
      proposals,
      activeContracts,
      completedContracts
    }
  });
});

router.get("/users", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const filter = q ? { $text: { $search: q } } : {};

  const users = await User.find(filter)
    .select("_id name email role accountStatus subscription createdAt lastLoginAt")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return res.json({ success: true, users });
});

router.patch("/users/:id/status", validate(userStatusSchema), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID." });
  }

  if (req.params.id === req.user._id.toString() && req.validated.status !== "active") {
    return res.status(400).json({ success: false, message: "You cannot suspend or close your own admin account." });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { accountStatus: req.validated.status },
    { new: true, runValidators: true }
  ).select("_id name email role accountStatus");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  return res.json({ success: true, message: "Account status updated.", user });
});

router.patch("/users/:id/subscription", validate(adminSubscriptionSchema), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID." });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "subscription.plan": req.validated.plan,
        "subscription.status": req.validated.status,
        "subscription.expiresAt": req.validated.expiresAt || null,
        "subscription.startedAt": new Date()
      }
    },
    { new: true, runValidators: true }
  ).select("_id name email role subscription");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  return res.json({ success: true, message: "Subscription updated.", user });
});

router.get("/projects", async (_req, res) => {
  const projects = await Project.find()
    .populate("client", "name email")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return res.json({ success: true, projects });
});

export default router;
