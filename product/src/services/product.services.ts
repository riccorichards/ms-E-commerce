import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModal from "../database/models/product.model";
import log from "../utils/logger";
import { ProductDocument, ProductInput } from "../database/types/types.product";

export const createProduct = async (input: ProductInput) => {
  try {
    return await ProductModal.create(input);
  } catch (error: any) {
    log.error("Error while creating product:", error.message);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    return await ProductModal.find();
  } catch (error: any) {
    log.error("Error while fetching all products:", error.message);
    throw error;
  }
};

export const getSpecificProduct = async (
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) => {
  try {
    return await ProductModal.findOne(query, {}, options);
  } catch (error: any) {
    log.error("Error while fetching specific product:", error.message);
    throw error;
  }
};

export const updateProduct = async (
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options = {}
) => {
  try {
    return await ProductModal.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    log.error("Error while updating product:", error.message);
    throw error;
  }
};

export const deleteProduct = async (query: FilterQuery<ProductDocument>) => {
  try {
    return await ProductModal.findOneAndDelete(query);
  } catch (error: any) {
    log.error("Error while deleting product:", error.message);
    throw error;
  }
};
