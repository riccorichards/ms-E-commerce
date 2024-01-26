import mongoose from "mongoose";
import { FeedbackDocType } from "../types/type.feedback";

const feedback = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    author: { type: String },
    authorImg: { type: String },
    address: { type: String },
    targetId: { type: Number },
    targetTitle: { type: String },
    targetImg: { type: String },
    forVendorId: { type: String },
    vendor_rating: { type: Number },
    review: { type: String },
    feedId: { type: Number },
  },
  { timestamps: true }
);

const FeedbackModel = mongoose.model<FeedbackDocType>("Feedback", feedback);

export default FeedbackModel;
