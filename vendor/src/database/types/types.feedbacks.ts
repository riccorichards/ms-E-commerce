import mongoose from "mongoose";

export interface FeedbackMessageType {
  userId: string;
  author: string;
  authorImg: string;
  address: "product" | "vendor" | "deliveryman";
  targetId?: number;
  targetTitle: string;
  targetImg: string;
  forVendorId: string;
  vendor_rating: number;
  review: string;
  feedId: number;
}

export interface FeedbacksDocsType extends FeedbackMessageType {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateFeedbackWithCustomerInfo {
  userId: string;
  updatedImage: string;
  updatedUsername: string;
}
