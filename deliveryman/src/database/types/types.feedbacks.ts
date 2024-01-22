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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FeedbacksDocsType extends FeedbackMessageType {
  id: number;
}
