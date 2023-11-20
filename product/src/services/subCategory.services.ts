import { FilterQuery, QueryOptions } from "mongoose";
import log from "../utils/logger";
import { UpdateOptions } from "sequelize";
import SubCategoryModal from "../database/models/subCaterogy.model";
import {
  SubCategoryDocument,
  subCagetoryInput,
} from "../database/types/types.subCategory";

//retrieve all existing categories
export const getAllSubCat = async () => {
  try {
    return await SubCategoryModal.find();
  } catch (error: any) {
    log.error("Error while fetching all sub categories:", error.message);
    throw error;
  }
};

//retrieve the specific category
export const findSpecialSubCategory = async (
  query: FilterQuery<SubCategoryDocument>,
  options: QueryOptions = { lean: true }
) => {
  try {
    return await SubCategoryModal.findOne(query, {}, options);
  } catch (error: any) {
    log.error("Error while fetching sub category:", error.message);
    throw error;
  }
};

//create main category
export const createSubCaterogy = async (input: subCagetoryInput) => {
  try {
    return await SubCategoryModal.create(input);
  } catch (error: any) {
    log.error("Error while creating sub category:", error.message);
    throw error;
  }
};

//update category
export const updateSubCategory = async (
  query: FilterQuery<SubCategoryDocument>,
  update: UpdateOptions<SubCategoryDocument>,
  options = {}
) => {
  try {
    return await SubCategoryModal.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    log.error("Error while updating sub category:", error.message);
    throw error;
  }
};

//delete main category
export const deleteSubCategory = async (
  query: FilterQuery<SubCategoryDocument>
) => {
  try {
    return SubCategoryModal.findOneAndDelete(query);
  } catch (error: any) {
    log.error("Error while deleting sub category:", error.message);
    throw error;
  }
};
