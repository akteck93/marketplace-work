import express from "express";
import mongoose from "mongoose";

import Review from "../models/Review.js";
import Contract from "../models/Contract.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { reviewSchema } from "../validators/schemas.js";
import { notify } from "../services/notifications.js";

const router = express.Router();

router.post("/", requireAuth, validate(reviewSchema), async (req, res) => {
  const { contractId, rating, comment } = req.validated;

  if (!mongoose.isValidObjectId(contractId)) {
    return res.status(400).json({ success: false, message: "Invalid contract ID." });
  }

  const contract = await Contract.findById(contractId);

  if (!contract || contract.status !== "completed") {
    return res.status(404).json({ success: false, message: "Completed contract not found." });
  }

  const current = req.user._id.toString();
  const isClient = contract.client.toString() === current;
  const isProvider = contract.provider.toString() === current;

  if (!isClient && !isProvider) {
    return res.status(403).json({ success: false, message: "You cannot review this contract." });
  }

  const reviewee = isClient ? contract.provider : contract.client;

  try {
    const review = await Review.create({
      contract: contract._id,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment
    });

    const [stats] = await Review.aggregate([
      { $match: { reviewee } },
      {
        $group: {
          _id: "$reviewee",
          average: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    if (stats) {
      await User.findByIdAndUpdate(reviewee, {
        rating: {
          average: Math.round(stats.average * 10) / 10,
          count: stats.count
        }
      });
    }

    await notify(
      reviewee,
      "review_received",
      "New review received",
      `${req.user.name} left you a ${rating}-star review.`,
      "/dashboard/reviews"
    );

    return res.status(201).json({ success: true, message: "Review published.", review });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "You already reviewed this contract." });
    }
    throw error;
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  const reviews = await Review.find({
    $or: [{ reviewer: req.user._id }, { reviewee: req.user._id }]
  })
    .populate("reviewer", "name role")
    .populate("reviewee", "name role")
    .populate("contract", "title")
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ success: true, reviews });
});

export default router;
