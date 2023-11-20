import mongoose from "mongoose";
import { UserDocument } from "./types.customer";
import { ProductDocument } from "./types.product";

export interface ProductReviewInput {
  user: UserDocument["_id"];
  product: ProductDocument["_id"];
  review: string;
  rating: number;
}

export interface ProductReviewDocument
  extends ProductReviewInput,
    mongoose.Document {
  createAt: Date;
  updateAt: Date;
}
