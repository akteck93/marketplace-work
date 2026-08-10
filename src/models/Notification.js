import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: [
        "proposal_received",
        "proposal_shortlisted",
        "proposal_rejected",
        "offer_received",
        "offer_accepted",
        "offer_declined",
        "message_received",
        "milestone_submitted",
        "milestone_approved",
        "revision_requested",
        "contract_completed",
        "review_received",
        "system"
      ],
      required: true
    },
    title: { type: String, required: true, maxlength: 180 },
    body: { type: String, required: true, maxlength: 1000 },
    link: { type: String, maxlength: 240, default: "" },
    isRead: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
