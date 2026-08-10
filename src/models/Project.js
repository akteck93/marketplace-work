import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 160
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 8000
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true
    },
    subcategory: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ""
    },
    skills: { type: [String], default: [] },
    contractType: {
      type: String,
      enum: ["fixed", "hourly"],
      required: true,
      index: true
    },
    budget: {
      type: Number,
      min: 1,
      max: 1000000000,
      default: null
    },
    hourlyMin: {
      type: Number,
      min: 1,
      max: 10000000,
      default: null
    },
    hourlyMax: {
      type: Number,
      min: 1,
      max: 10000000,
      default: null
    },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP", "AED", "SGD"],
      default: "INR"
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      default: "intermediate"
    },
    locationType: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      default: "remote"
    },
    location: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "Remote"
    },
    duration: {
      type: String,
      enum: ["under_1_month", "1_3_months", "3_6_months", "over_6_months", "ongoing"],
      default: "1_3_months"
    },
    visibility: {
      type: String,
      enum: ["public", "marketplace"],
      default: "marketplace"
    },
    expirationDate: {
      type: Date,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["draft", "open", "hired", "closed", "expired", "cancelled"],
      default: "open",
      index: true
    },
    proposalCount: {
      type: Number,
      min: 0,
      default: 0
    },
    shortlistedCount: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
);

projectSchema.index({ status: 1, expirationDate: 1, createdAt: -1 });
projectSchema.index({ category: 1, status: 1, createdAt: -1 });
projectSchema.index({ title: "text", description: "text", skills: "text" });

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
