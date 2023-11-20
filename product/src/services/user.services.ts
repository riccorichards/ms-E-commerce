import UserModel from "../database/models/user.model";
import { UserDocument } from "../database/types/types.customer";
import log from "../utils/logger";
import { FilterQuery, UpdateQuery } from "mongoose";

// find one the specific user
export const findUser = async (query: FilterQuery<UserDocument>) => {
  try {
    return await UserModel.findOne(query).lean();
  } catch (error: any) {
    log.error(error.message);
  }
};

//find and get all users
export const findAllUsers = async () => {
  try {
    return await UserModel.find().lean();
  } catch (error: any) {
    log.error(error.message);
  }
};

// find the user and update
export const updateUser = async (
  query: FilterQuery<UserDocument>,
  updade: UpdateQuery<UserDocument>,
  options = {}
) => {
  try {
    return await UserModel.findOneAndUpdate(query, updade, options);
  } catch (error: any) {
    log.error(error.message);
  }
};

//remove the user
export const removeUser = async (query: FilterQuery<UserDocument>) => {
  try {
    return await UserModel.findOneAndRemove(query);
  } catch (error: any) {
    log.error(error.message);
  }
};
