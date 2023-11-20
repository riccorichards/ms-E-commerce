import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import log from "../utils/logger";
import {
  OrderItemDocument,
  OrderItemInput,
} from "../database/types/types.orderItem";
import OrderItemModel from "../database/models/orderItem.model";

export const createOrderItem = async (input: OrderItemInput) => {
  try {
    return await OrderItemModel.create(input);
  } catch (error: any) {
    log.error("Error while creating OrderItem:", error.message);
    throw error;
  }
};

export const getAllOrderItems = async () => {
  try {
    return await OrderItemModel.find();
  } catch (error: any) {
    log.error("Error while fetching all orderItems:", error.message);
    throw error;
  }
};

export const getSpecificOrderItem = async (
  query: FilterQuery<OrderItemDocument>,
  options: QueryOptions = { lean: true }
) => {
  try {
    return await OrderItemModel.findOne(query, {}, options);
  } catch (error: any) {
    log.error("Error while fetching specific orderItem:", error.message);
    throw error;
  }
};

export const updateOrderItem = async (
  query: FilterQuery<OrderItemDocument>,
  update: UpdateQuery<OrderItemDocument>,
  options = {}
) => {
  try {
    return await OrderItemModel.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    log.error("Error while updating orderItem:", error.message);
    throw error;
  }
};

export const deleteOrderItem = async (
  query: FilterQuery<OrderItemDocument>
) => {
  try {
    return await OrderItemModel.findOneAndDelete(query);
  } catch (error: any) {
    log.error("Error while deleting orderItem:", error.message);
    throw error;
  }
};
