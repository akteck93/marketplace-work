import express from "express";
import mongoose from "mongoose";

import Project from "../models/Project.js";
import Proposal from "../models/Proposal.js";
import User from "../models/User.js";
import { requireAuth, requireRole, requireSubscription, hasActiveSubscription } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { projectSchema } from "../validators/schemas.js";

const router = express.Router();

function stateClientIdentity(user) {
  return user?.role !== "provider" || hasActiveSubscription(user);
}

function redactClient(client, canSeeIdentity) {
  if (!client || canSeeIdentity) return client;
  return {
    _id: client._id,
    name: "Workiffy Client",
    rating: client.rating,
    completedContracts: client.completedContracts
  };
}

router.get("/", requireAuth, async (req, res) => {
  const q = String(req.query.q || "").trim();
  const category = String(req.query.category || "").trim();
  const contractType = String(req.query.contractType || "").trim();
  const experienceLevel = String(req.query.experienceLevel || "").trim();
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(30, Math.max(1, Number(req.query.limit || 12)));

  const filter = {
    status: "open",
    expirationDate: { $gte: new Date() }
  };

  if (category) filter.category = category;
  if (contractType) filter.contractType = contractType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (q) filter.$text = { $search: q };

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("client", "name profile.companyName profile.location rating completedContracts")
      .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter)
  ]);

  const saved = new Set((req.user.savedProjects || []).map((value) => value.toString()));

  const canSeeClientIdentity = stateClientIdentity(req.user);

  return res.json({
    success: true,
    projects: projects.map((project) => ({
      ...project,
      client: redactClient(project.client, canSeeClientIdentity),
      saved: saved.has(project._id.toString())
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

router.get("/mine", requireAuth, requireRole("client"), async (req, res) => {
  const projects = await Project.find({ client: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ success: true, projects });
});

router.get("/saved", requireAuth, requireRole("provider"), async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedProjects",
    populate: { path: "client", select: "name profile.companyName rating" }
  });

  const canSeeClientIdentity = stateClientIdentity(req.user);
  const projects = (user?.savedProjects || []).map((project) => {
    const data = project.toObject ? project.toObject() : project;
    data.client = redactClient(data.client, canSeeClientIdentity);
    return data;
  });

  return res.json({ success: true, projects });
});

router.get("/:id", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project ID." });
  }

  const project = await Project.findById(req.params.id)
    .populate("client", "name profile.companyName profile.location rating completedContracts")
    .lean();

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found." });
  }

  project.client = redactClient(project.client, stateClientIdentity(req.user));

  return res.json({ success: true, project });
});

router.post(
  "/",
  requireAuth,
  requireRole("client"),
  requireSubscription,
  validate(projectSchema),
  async (req, res) => {
    if (req.validated.expirationDate <= new Date()) {
      return res.status(400).json({ success: false, message: "Expiration date must be in the future." });
    }

    const project = await Project.create({
      ...req.validated,
      client: req.user._id,
      status: "open"
    });

    return res.status(201).json({
      success: true,
      message: "Project posted successfully.",
      project
    });
  }
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("client"),
  validate(projectSchema),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID." });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, client: req.user._id, status: { $in: ["draft", "open"] } },
      { $set: req.validated },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Editable project not found." });
    }

    return res.json({ success: true, message: "Project updated.", project });
  }
);

router.patch("/:id/close", requireAuth, requireRole("client"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project ID." });
  }

  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, client: req.user._id, status: "open" },
    { status: "closed" },
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ success: false, message: "Open project not found." });
  }

  await Proposal.updateMany(
    { project: project._id, status: { $in: ["submitted", "shortlisted"] } },
    { status: "rejected" }
  );

  return res.json({ success: true, message: "Project closed.", project });
});

router.post("/:id/save", requireAuth, requireRole("provider"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project ID." });
  }

  const project = await Project.findOne({ _id: req.params.id, status: "open" });

  if (!project) {
    return res.status(404).json({ success: false, message: "Open project not found." });
  }

  const isSaved = req.user.savedProjects.some((id) => id.toString() === project._id.toString());

  await User.findByIdAndUpdate(
    req.user._id,
    isSaved
      ? { $pull: { savedProjects: project._id } }
      : { $addToSet: { savedProjects: project._id } }
  );

  return res.json({
    success: true,
    saved: !isSaved,
    message: isSaved ? "Project removed from saved list." : "Project saved."
  });
});

export default router;
