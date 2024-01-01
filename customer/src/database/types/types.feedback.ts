import mongoose from "mongoose";

export interface FeedbackMessageType {
  userId: string;
  author: string;
  authorImg: string;
  address: "product" | "vendor" | "deliveryman";
  targetId: number;
  targetTitle: string;
  targetImg: string;
  forVendorId?: string;
  vendor_rating?: number;
  review: string;
  feedId: number;
}

export interface FeedbackDocType
  extends FeedbackMessageType,
    mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
