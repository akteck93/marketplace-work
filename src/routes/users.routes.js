import express from "express";
import mongoose from "mongoose";

import User from "../models/User.js";
import Review from "../models/Review.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { profileSchema } from "../validators/schemas.js";
import { publicUser } from "../utils/auth.js";

const router = express.Router();

router.patch("/me", requireAuth, validate(profileSchema), async (req, res) => {
  const { name, ...profile } = req.validated;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, profile } },
    { new: true, runValidators: true }
  );

  return res.json({ success: true, message: "Profile updated.", user: publicUser(user) });
});

router.get("/providers", requireAuth, requireRole("client"), async (req, res) => {
  const q = String(req.query.q || "").trim();
  const skill = String(req.query.skill || "").trim();
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(30, Math.max(1, Number(req.query.limit || 12)));

  const filter = { role: "provider", accountStatus: "active" };

  if (skill) filter["profile.skills"] = { $regex: skill, $options: "i" };
  if (q) filter.$text = { $search: q };

  const [providers, total] = await Promise.all([
    User.find(filter)
      .select("_id name profile rating completedContracts")
      .sort(q ? { score: { $meta: "textScore" } } : { "rating.average": -1, completedContracts: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter)
  ]);

  const saved = new Set((req.user.savedProviders || []).map((value) => value.toString()));

  return res.json({
    success: true,
    providers: providers.map((provider) => ({
      ...provider,
      saved: saved.has(provider._id.toString())
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

router.get("/providers/saved", requireAuth, requireRole("client"), async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedProviders",
    select: "_id name profile rating completedContracts"
  });

  return res.json({ success: true, providers: user?.savedProviders || [] });
});

router.post("/providers/:id/save", requireAuth, requireRole("client"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid provider ID." });
  }

  const provider = await User.findOne({
    _id: req.params.id,
    role: "provider",
    accountStatus: "active"
  });

  if (!provider) {
    return res.status(404).json({ success: false, message: "Provider not found." });
  }

  const isSaved = req.user.savedProviders.some((id) => id.toString() === provider._id.toString());

  await User.findByIdAndUpdate(
    req.user._id,
    isSaved
      ? { $pull: { savedProviders: provider._id } }
      : { $addToSet: { savedProviders: provider._id } }
  );

  return res.json({
    success: true,
    saved: !isSaved,
    message: isSaved ? "Provider removed from saved list." : "Provider saved."
  });
});

router.get("/:id/reviews", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID." });
  }

  const reviews = await Review.find({ reviewee: req.params.id })
    .populate("reviewer", "name role")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return res.json({ success: true, reviews });
});

export default router;
