import express from "express";
import mongoose from "mongoose";

import Contract from "../models/Contract.js";
import Project from "../models/Project.js";
import Proposal from "../models/Proposal.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  messageSchema,
  milestoneSubmissionSchema,
  milestoneDecisionSchema
} from "../validators/schemas.js";
import { notify } from "../services/notifications.js";

const router = express.Router();

function isParticipant(contract, userId) {
  const value = userId.toString();
  return contract.client.toString() === value || contract.provider.toString() === value;
}

router.get("/mine", requireAuth, async (req, res) => {
  const field = req.user.role === "client" ? "client" : "provider";

  const contracts = await Contract.find({ [field]: req.user._id })
    .populate("client", "name profile rating")
    .populate("provider", "name profile rating completedContracts")
    .populate("project", "title status category")
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ success: true, contracts });
});

router.get("/:id", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid contract ID." });
  }

  const contract = await Contract.findById(req.params.id)
    .populate("client", "name profile rating")
    .populate("provider", "name profile rating completedContracts")
    .populate("project", "title description skills status category")
    .lean();

  if (!contract || !isParticipant(contract, req.user._id)) {
    return res.status(404).json({ success: false, message: "Contract not found." });
  }

  return res.json({ success: true, contract });
});

router.post("/:id/accept", requireAuth, requireRole("provider"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid contract ID." });
  }

  const contract = await Contract.findOne({
    _id: req.params.id,
    provider: req.user._id,
    status: "offer_pending"
  });

  if (!contract) {
    return res.status(404).json({ success: false, message: "Pending offer not found." });
  }

  contract.status = "active";
  contract.acceptedAt = new Date();

  if (contract.contractType === "fixed") {
    const first = contract.milestones.find((milestone) => milestone.status === "planned");
    if (first) first.status = "active";
  }

  await contract.save();

  await Proposal.findByIdAndUpdate(contract.proposal, { status: "accepted" });
  await Project.findByIdAndUpdate(contract.project, { status: "hired" });

  await Proposal.updateMany(
    {
      project: contract.project,
      _id: { $ne: contract.proposal },
      status: { $in: ["submitted", "shortlisted"] }
    },
    { status: "rejected" }
  );

  await notify(
    contract.client,
    "offer_accepted",
    "Offer accepted",
    `${req.user.name} accepted your Workiffy contract offer.`,
    `/dashboard/contracts/${contract._id}`
  );

  return res.json({ success: true, message: "Offer accepted. Contract is active.", contract });
});

router.post("/:id/reject", requireAuth, requireRole("provider"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid contract ID." });
  }

  const contract = await Contract.findOne({
    _id: req.params.id,
    provider: req.user._id,
    status: "offer_pending"
  });

  if (!contract) {
    return res.status(404).json({ success: false, message: "Pending offer not found." });
  }

  contract.status = "cancelled";
  await contract.save();
  await Proposal.findByIdAndUpdate(contract.proposal, { status: "rejected" });

  await notify(
    contract.client,
    "offer_declined",
    "Offer declined",
    `${req.user.name} declined the contract offer.`,
    "/dashboard/contracts"
  );

  return res.json({ success: true, message: "Offer declined." });
});

router.get("/:id/messages", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid contract ID." });
  }

  const contract = await Contract.findById(req.params.id);

  if (!contract || !isParticipant(contract, req.user._id)) {
    return res.status(404).json({ success: false, message: "Contract not found." });
  }

  const messages = await Message.find({ contract: contract._id })
    .populate("sender", "name role")
    .sort({ createdAt: 1 })
    .limit(1000)
    .lean();

  await Message.updateMany(
    { contract: contract._id, readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );

  return res.json({ success: true, messages });
});

router.post(
  "/:id/messages",
  requireAuth,
  validate(messageSchema),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid contract ID." });
    }

    const contract = await Contract.findById(req.params.id);

    if (
      !contract ||
      !isParticipant(contract, req.user._id) ||
      !["offer_pending", "active"].includes(contract.status)
    ) {
      return res.status(404).json({ success: false, message: "Active workroom not found." });
    }

    const message = await Message.create({
      contract: contract._id,
      sender: req.user._id,
      body: req.validated.body,
      readBy: [req.user._id]
    });

    await message.populate("sender", "name role");

    const recipient =
      contract.client.toString() === req.user._id.toString()
        ? contract.provider
        : contract.client;

    await notify(
      recipient,
      "message_received",
      "New workroom message",
      `${req.user.name} sent a message in "${contract.title}".`,
      `/dashboard/contracts/${contract._id}`
    );

    return res.status(201).json({ success: true, message: "Message sent.", data: message });
  }
);

router.post(
  "/:id/milestones/:milestoneId/submit",
  requireAuth,
  requireRole("provider"),
  validate(milestoneSubmissionSchema),
  async (req, res) => {
    if (
      !mongoose.isValidObjectId(req.params.id) ||
      !mongoose.isValidObjectId(req.params.milestoneId)
    ) {
      return res.status(400).json({ success: false, message: "Invalid ID." });
    }

    const contract = await Contract.findOne({
      _id: req.params.id,
      provider: req.user._id,
      status: "active"
    });

    if (!contract) {
      return res.status(404).json({ success: false, message: "Active contract not found." });
    }

    const milestone = contract.milestones.id(req.params.milestoneId);

    if (!milestone || !["active", "revision_requested"].includes(milestone.status)) {
      return res.status(409).json({ success: false, message: "Milestone cannot be submitted." });
    }

    milestone.status = "submitted";
    milestone.submissionNote = req.validated.note;
    milestone.submittedAt = new Date();
    await contract.save();

    await notify(
      contract.client,
      "milestone_submitted",
      "Milestone submitted",
      `${req.user.name} submitted "${milestone.title}" for review.`,
      `/dashboard/contracts/${contract._id}`
    );

    return res.json({ success: true, message: "Milestone submitted for review.", contract });
  }
);

router.post(
  "/:id/milestones/:milestoneId/decision",
  requireAuth,
  requireRole("client"),
  validate(milestoneDecisionSchema),
  async (req, res) => {
    if (
      !mongoose.isValidObjectId(req.params.id) ||
      !mongoose.isValidObjectId(req.params.milestoneId)
    ) {
      return res.status(400).json({ success: false, message: "Invalid ID." });
    }

    const contract = await Contract.findOne({
      _id: req.params.id,
      client: req.user._id,
      status: "active"
    });

    if (!contract) {
      return res.status(404).json({ success: false, message: "Active contract not found." });
    }

    const milestone = contract.milestones.id(req.params.milestoneId);

    if (!milestone || milestone.status !== "submitted") {
      return res.status(409).json({ success: false, message: "Milestone is not awaiting review." });
    }

    if (req.validated.action === "request_revision") {
      milestone.status = "revision_requested";
      milestone.clientNote = req.validated.note;

      await notify(
        contract.provider,
        "revision_requested",
        "Revision requested",
        `A revision was requested for "${milestone.title}".`,
        `/dashboard/contracts/${contract._id}`
      );
    } else {
      milestone.status = "approved";
      milestone.clientNote = req.validated.note;
      milestone.approvedAt = new Date();

      const next = contract.milestones.find((item) => item.status === "planned");
      if (next) next.status = "active";

      await notify(
        contract.provider,
        "milestone_approved",
        "Milestone approved",
        `"${milestone.title}" was approved.`,
        `/dashboard/contracts/${contract._id}`
      );
    }

    await contract.save();

    return res.json({
      success: true,
      message: req.validated.action === "approve" ? "Milestone approved." : "Revision requested.",
      contract
    });
  }
);

router.post("/:id/complete", requireAuth, requireRole("client"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid contract ID." });
  }

  const contract = await Contract.findOne({
    _id: req.params.id,
    client: req.user._id,
    status: "active"
  });

  if (!contract) {
    return res.status(404).json({ success: false, message: "Active contract not found." });
  }

  if (
    contract.contractType === "fixed" &&
    contract.milestones.some((milestone) => milestone.status !== "approved")
  ) {
    return res.status(409).json({
      success: false,
      message: "Approve all milestones before completing the contract."
    });
  }

  contract.status = "completed";
  contract.completedAt = new Date();
  await contract.save();

  await User.findByIdAndUpdate(contract.provider, { $inc: { completedContracts: 1 } });

  await notify(
    contract.provider,
    "contract_completed",
    "Contract completed",
    `"${contract.title}" was marked complete.`,
    "/dashboard/contracts"
  );

  return res.json({
    success: true,
    message: "Contract completed. Reviews are now available.",
    contract
  });
});

export default router;
