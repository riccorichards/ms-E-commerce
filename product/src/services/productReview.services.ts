import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import log from "../utils/logger";
import {
  ProductReviewDocument,
  ProductReviewInput,
} from "../database/types/types.productReview";
import ProductReviewModal from "../database/models/Feedbacks.model";

export const createProductReview = async (input: ProductReviewInput) => {
  try {
    return await ProductReviewModal.create(input);
  } catch (error: any) {
    log.error("Error while creating product review:", error.message);
    throw error;
  }
};

export const getAllProductReviews = async () => {
  try {
    return await ProductReviewModal.find();
  } catch (error: any) {
    log.error("Error while fetching all product reviews:", error.message);
    throw error;
  }
};

export const getSpecificProductReview = async (
  query: FilterQuery<ProductReviewDocument>,
  options: QueryOptions = { lean: true }
) => {
  try {
    return await ProductReviewModal.findOne(query, {}, options);
  } catch (error: any) {
    log.error("Error while fetching specific product review:", error.message);
    throw error;
  }
};

export const updateProductReview = async (
  query: FilterQuery<ProductReviewDocument>,
  update: UpdateQuery<ProductReviewDocument>,
  options = {}
) => {
  try {
    return await ProductReviewModal.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    log.error("Error while updating product review:", error.message);
    throw error;
  }
};

export const deleteProductReview = async (
  query: FilterQuery<ProductReviewDocument>
) => {
  try {
    return await ProductReviewModal.findOneAndDelete(query);
  } catch (error: any) {
    log.error("Error while deleting product review:", error.message);
    throw error;
  }
};
