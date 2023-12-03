import mongoose from "mongoose";
import { OrderDocsType } from "../types/types.order";

const order = new mongoose.Schema(
  {
    orderId: { type: Number },
    email: {type: String},
    order_status: {type: String},
    note: {type: String},
    amount: { type: String },
    orderItem: { type: mongoose.Schema.ObjectId, ref:"items" },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<OrderDocsType>("Order", order);

export default OrderModel;
