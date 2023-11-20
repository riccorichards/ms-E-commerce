import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import log from "../utils/logger";
import { OrderDocument, OrderInput } from "../database/types/types.order";
import OrderModel from "../database/models/order.model";

export const createOrder = async (input: OrderInput) => {
  try {
    return await OrderModel.create(input);
  } catch (error: any) {
    log.error("Error while creating Order:", error.message);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    return await OrderModel.find();
  } catch (error: any) {
    log.error("Error while fetching all orders:", error.message);
    throw error;
  }
};

export const getSpecificOrder = async (
  query: FilterQuery<OrderDocument>,
  options: QueryOptions = { lean: true }
) => {
  try {
    return await OrderModel.findOne(query, {}, options);
  } catch (error: any) {
    log.error("Error while fetching specific order:", error.message);
    throw error;
  }
};

export const updateOrder = async (
  query: FilterQuery<OrderDocument>,
  update: UpdateQuery<OrderDocument>,
  options = {}
) => {
  try {
    return await OrderModel.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    log.error("Error while updating order:", error.message);
    throw error;
  }
};

export const deleteOrder = async (query: FilterQuery<OrderDocument>) => {
  try {
    return await OrderModel.findOneAndDelete(query);
  } catch (error: any) {
    log.error("Error while deleting order:", error.message);
    throw error;
  }
};
