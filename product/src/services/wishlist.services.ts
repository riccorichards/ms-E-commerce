import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import log from "../utils/logger";
import {
  WishlistDocument,
  WishlistInput,
} from "../database/types/types.wishlist";
import WishlishModel from "../database/models/wishlist.model";

export const createWishlist = async (input: WishlistInput) => {
  try {
    return await WishlishModel.create(input);
  } catch (error: any) {
    log.error("Error while creating wishlist:", error.message);
    throw error;
  }
};

export const getAllWishlists = async () => {
  try {
    return await WishlishModel.find();
  } catch (error: any) {
    log.error("Error while fetching all wishlists:", error.message);
    throw error;
  }
};

export const getSpecificWishlist = async (
  query: FilterQuery<WishlistDocument>,
  options: QueryOptions = { lean: true }
) => {
  try {
    return await WishlishModel.findOne(query, {}, options);
  } catch (error: any) {
    log.error("Error while fetching specific wishlist:", error.message);
    throw error;
  }
};

export const updateWishlist = async (
  query: FilterQuery<WishlistDocument>,
  update: UpdateQuery<WishlistDocument>,
  options = {}
) => {
  try {
    return await WishlishModel.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    log.error("Error while updating wishlist:", error.message);
    throw error;
  }
};

export const deleteWishlist = async (query: FilterQuery<WishlistDocument>) => {
  try {
    return await WishlishModel.findOneAndDelete(query);
  } catch (error: any) {
    log.error("Error while deleting wishlist:", error.message);
    throw error;
  }
};
