import express from "express";
import mongoose from "mongoose";

import Proposal from "../models/Proposal.js";
import Project from "../models/Project.js";
import Contract from "../models/Contract.js";
import { requireAuth, requireRole, requireSubscription } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  proposalSchema,
  proposalDecisionSchema,
  offerSchema
} from "../validators/schemas.js";
import { notify } from "../services/notifications.js";

const router = express.Router();

router.get("/mine", requireAuth, requireRole("provider"), async (req, res) => {
  const proposals = await Proposal.find({ provider: req.user._id })
    .populate("project", "title contractType budget hourlyMin hourlyMax currency status")
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ success: true, proposals });
});

router.get("/project/:projectId", requireAuth, requireRole("client"), requireSubscription, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.projectId)) {
    return res.status(400).json({ success: false, message: "Invalid project ID." });
  }

  const project = await Project.findOne({
    _id: req.params.projectId,
    client: req.user._id
  }).lean();

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found." });
  }

  const proposals = await Proposal.find({ project: project._id })
    .populate("provider", "name profile rating completedContracts")
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ success: true, project, proposals });
});

router.post(
  "/",
  requireAuth,
  requireRole("provider"),
  requireSubscription,
  validate(proposalSchema),
  async (req, res) => {
    const { projectId, coverLetter, bidAmount, estimatedDays } = req.validated;

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project ID." });
    }

    const project = await Project.findOne({
      _id: projectId,
      status: "open",
      expirationDate: { $gte: new Date() }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project is not open for proposals." });
    }

    if (project.client.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot apply to your own project." });
    }

    try {
      const proposal = await Proposal.create({
        project: project._id,
        provider: req.user._id,
        coverLetter,
        bidAmount,
        estimatedDays
      });

      await Project.findByIdAndUpdate(project._id, { $inc: { proposalCount: 1 } });

      await notify(
        project.client,
        "proposal_received",
        "New proposal received",
        `${req.user.name} submitted a proposal for "${project.title}".`,
        `/dashboard/projects/${project._id}`
      );

      return res.status(201).json({
        success: true,
        message: "Proposal submitted successfully.",
        proposal
      });
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "You already submitted a proposal for this project."
        });
      }
      throw error;
    }
  }
);

router.patch(
  "/:id/decision",
  requireAuth,
  requireRole("client"),
  validate(proposalDecisionSchema),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid proposal ID." });
    }

    const proposal = await Proposal.findById(req.params.id).populate("project");

    if (!proposal || proposal.project.client.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: "Proposal not found." });
    }

    if (!["submitted", "shortlisted"].includes(proposal.status)) {
      return res.status(409).json({ success: false, message: "Proposal status cannot be changed." });
    }

    const { action, note } = req.validated;
    const oldStatus = proposal.status;
    proposal.status = action === "shortlist" ? "shortlisted" : "rejected";
    proposal.clientNote = note;
    proposal.viewedAt ||= new Date();
    await proposal.save();

    if (action === "shortlist" && oldStatus !== "shortlisted") {
      await Project.findByIdAndUpdate(proposal.project._id, { $inc: { shortlistedCount: 1 } });
    }

    await notify(
      proposal.provider,
      action === "shortlist" ? "proposal_shortlisted" : "proposal_rejected",
      action === "shortlist" ? "Your proposal was shortlisted" : "Proposal update",
      `Your proposal for "${proposal.project.title}" was ${action === "shortlist" ? "shortlisted" : "not selected"}.`,
      "/dashboard/proposals"
    );

    return res.json({
      success: true,
      message: action === "shortlist" ? "Proposal shortlisted." : "Proposal rejected.",
      proposal
    });
  }
);

router.patch("/:id/withdraw", requireAuth, requireRole("provider"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid proposal ID." });
  }

  const proposal = await Proposal.findOne({
    _id: req.params.id,
    provider: req.user._id,
    status: { $in: ["submitted", "shortlisted"] }
  });

  if (!proposal) {
    return res.status(404).json({ success: false, message: "Proposal cannot be withdrawn." });
  }

  proposal.status = "withdrawn";
  await proposal.save();

  return res.json({ success: true, message: "Proposal withdrawn.", proposal });
});

router.post(
  "/:id/offer",
  requireAuth,
  requireRole("client"),
  requireSubscription,
  validate(offerSchema),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid proposal ID." });
    }

    const proposal = await Proposal.findById(req.params.id)
      .populate("project")
      .populate("provider", "name");

    if (!proposal || proposal.project.client.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: "Proposal not found." });
    }

    if (!["submitted", "shortlisted"].includes(proposal.status)) {
      return res.status(409).json({ success: false, message: "This proposal cannot receive an offer." });
    }

    let milestones = req.validated.milestones || [];
    const project = proposal.project;

    if (project.contractType === "fixed" && milestones.length === 0) {
      milestones = [{
        title: "Project delivery",
        description: "",
        amount: proposal.bidAmount,
        dueDate: project.expirationDate,
        status: "planned"
      }];
    }

    const totalValue =
      project.contractType === "fixed"
        ? milestones.reduce((sum, milestone) => sum + Number(milestone.amount || 0), 0)
        : proposal.bidAmount;

    try {
      const contract = await Contract.create({
        project: project._id,
        proposal: proposal._id,
        client: req.user._id,
        provider: proposal.provider._id,
        title: project.title,
        contractType: project.contractType,
        currency: project.currency,
        totalValue,
        hourlyRate: project.contractType === "hourly" ? proposal.bidAmount : 0,
        milestones
      });

      proposal.status = "offered";
      proposal.viewedAt ||= new Date();
      await proposal.save();

      await notify(
        proposal.provider._id,
        "offer_received",
        "You received a contract offer",
        `You received an offer for "${project.title}".`,
        "/dashboard/contracts"
      );

      return res.status(201).json({
        success: true,
        message: "Offer sent to the service provider.",
        contract
      });
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).json({ success: false, message: "An offer already exists for this proposal." });
      }
      throw error;
    }
  }
);

export default router;
