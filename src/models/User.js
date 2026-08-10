import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      enum: ["free", "provider", "client", "business"],
      default: "free"
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired", "cancelled"],
      default: "active"
    },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
    providerCustomerId: { type: String, default: "", select: false },
    providerSubscriptionId: { type: String, default: "", select: false }
  },
  { _id: false }
);

const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, min: 0, default: 0 }
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    headline: { type: String, trim: true, maxlength: 140, default: "" },
    bio: { type: String, trim: true, maxlength: 1800, default: "" },
    location: { type: String, trim: true, maxlength: 140, default: "" },
    country: { type: String, trim: true, maxlength: 80, default: "" },
    skills: { type: [String], default: [] },
    hourlyRate: { type: Number, min: 0, max: 10000000, default: 0 },
    companyName: { type: String, trim: true, maxlength: 140, default: "" },
    website: { type: String, trim: true, maxlength: 240, default: "" },
    portfolioUrl: { type: String, trim: true, maxlength: 240, default: "" },
    availability: {
      type: String,
      enum: ["available", "limited", "unavailable"],
      default: "available"
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["client", "provider", "admin"],
      required: true,
      index: true
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "closed"],
      default: "active",
      index: true
    },
    profile: {
      type: profileSchema,
      default: () => ({})
    },
    subscription: {
      type: subscriptionSchema,
      default: () => ({})
    },
    rating: {
      type: ratingSchema,
      default: () => ({})
    },
    completedContracts: {
      type: Number,
      min: 0,
      default: 0
    },
    savedProviders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    savedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ],
    lastLoginAt: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.index({
  name: "text",
  "profile.headline": "text",
  "profile.bio": "text",
  "profile.skills": "text"
});

userSchema.index({
  role: 1,
  accountStatus: 1,
  "rating.average": -1,
  completedContracts: -1
});

export default mongoose.models.User || mongoose.model("User", userSchema);
