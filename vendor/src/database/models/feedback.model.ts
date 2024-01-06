import mongoose from "mongoose";
import { FeedbacksDocsType } from "../types/types.feedbacks";

const feeds = new mongoose.Schema(
  {
    userId: { type: String },
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

const FeedsModel = mongoose.model<FeedbacksDocsType>("feeds", feeds);

export default FeedsModel;
