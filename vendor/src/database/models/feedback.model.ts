import mongoose from "mongoose";
import { FeedbacksDocsType } from "../types/types.feedbacks";

const feeds = new mongoose.Schema(
  {
    author: { type: String },
    profileImg: { type: String },
    to: { type: String },
    forVendor: { type: String },
    review: { type: String },
    rating: { type: String },
    feedId: { type: Number },
  },
  { timestamps: true }
);

const FeedsModel = mongoose.model<FeedbacksDocsType>("feeds", feeds);

export default FeedsModel;
