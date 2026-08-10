import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, trim: true, maxlength: 2200, default: "" },
    amount: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["planned", "active", "submitted", "revision_requested", "approved"],
      default: "planned"
    },
    submissionNote: { type: String, maxlength: 3000, default: "" },
    clientNote: { type: String, maxlength: 3000, default: "" },
    submittedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const contractSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
      unique: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    contractType: {
      type: String,
      enum: ["fixed", "hourly"],
      required: true
    },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP", "AED", "SGD"],
      default: "INR"
    },
    totalValue: { type: Number, min: 1, required: true },
    hourlyRate: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["offer_pending", "active", "completed", "cancelled"],
      default: "offer_pending",
      index: true
    },
    milestones: { type: [milestoneSchema], default: [] },
    acceptedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

contractSchema.index({ client: 1, status: 1, createdAt: -1 });
contractSchema.index({ provider: 1, status: 1, createdAt: -1 });

export default mongoose.models.Contract || mongoose.model("Contract", contractSchema);
