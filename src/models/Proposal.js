import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    coverLetter: {
      type: String,
      required: true,
      trim: true,
      minlength: 40,
      maxlength: 5000
    },
    bidAmount: {
      type: Number,
      required: true,
      min: 1,
      max: 1000000000
    },
    estimatedDays: {
      type: Number,
      required: true,
      min: 1,
      max: 3650
    },
    status: {
      type: String,
      enum: ["submitted", "shortlisted", "offered", "accepted", "rejected", "withdrawn"],
      default: "submitted",
      index: true
    },
    clientNote: {
      type: String,
      trim: true,
      maxlength: 1500,
      default: ""
    },
    viewedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

proposalSchema.index({ project: 1, provider: 1 }, { unique: true });
proposalSchema.index({ provider: 1, status: 1, createdAt: -1 });

export default mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);
