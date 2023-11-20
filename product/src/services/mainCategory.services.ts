import { FilterQuery, QueryOptions } from "mongoose";
import MainCategoryModal from "../database/models/mainCaterogy.model";
import {
  MainCatInput,
  MainCategoryDocument,
} from "../database/types/types.mainCategory";
import log from "../utils/logger";
import { UpdateOptions } from "sequelize";

//retrieve all existing categories
export const getAllCategories = async () => {
  try {
    return await MainCategoryModal.find();
  } catch (error: any) {
    log.error("Error while fetching categories:", error.message);
    throw error;
  }
};

//retrieve the specific category
export const findSpecialMainCategory = async (
  query: FilterQuery<MainCategoryDocument>,
  options: QueryOptions = { lean: true }
) => {
  try {
    return await MainCategoryModal.findOne(query, {}, options);
  } catch (error: any) {
    log.error("Error while fetching category:", error.message);
    throw error;
  }
};

//create main category
export const createMainCaterogy = async (input: MainCatInput) => {
  try {
    return await MainCategoryModal.create(input);
  } catch (error: any) {
    log.error("Error while creating category:", error.message);
    throw error;
  }
};

//update category
export const updateMainCategory = async (
  query: FilterQuery<MainCategoryDocument>,
  update: UpdateOptions<MainCategoryDocument>,
  options = {}
) => {
  try {
    return await MainCategoryModal.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    log.error("Error while updating category:", error.message);
    throw error;
  }
};

//delete main category
export const deleteMainCategory = async (
  query: FilterQuery<MainCategoryDocument>
) => {
  try {
    return MainCategoryModal.findOneAndDelete(query);
  } catch (error: any) {
    log.error("Error while updating category:", error.message);
    throw error;
  }
};
