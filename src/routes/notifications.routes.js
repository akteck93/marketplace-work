import express from "express";
import mongoose from "mongoose";

import Notification from "../models/Notification.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return res.json({ success: true, notifications });
});

router.patch("/:id/read", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid notification ID." });
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found." });
  }

  return res.json({ success: true, notification });
});

router.patch("/read-all", requireAuth, async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  return res.json({ success: true, message: "Notifications marked as read." });
});

export default router;
