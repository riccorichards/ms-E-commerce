import mongoose from "mongoose";

import { ProductReviewDocument } from "../types/types.productReview";

const ProductFeeds = new mongoose.Schema(
  {
    user: {
      username: String,
      profileImg: String,
    },
    review: { type: String, default: null },
    rating: { type: Number, default: null },
  },
  { timestamps: true }
);

const ProductFeedsModel = mongoose.model<ProductReviewDocument>(
  "Product_feeds",
  ProductFeeds
);

export default ProductFeedsModel;
