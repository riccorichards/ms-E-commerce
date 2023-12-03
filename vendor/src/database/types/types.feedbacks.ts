import mongoose from "mongoose";

export interface FeedbackMessageType {
  author: string;
  profileImg?: string;
  to: string;
  forVendor: string;
  review: string;
  rating: number;
  feedId: number;
}

export interface FeedbacksDocsType extends FeedbackMessageType {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
}
