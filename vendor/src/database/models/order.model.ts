import mongoose from "mongoose";
import { OrderDocument } from "../types/type.order";

const Order = new mongoose.Schema(
  {
    order_status: { type: String },
    total_amount: { type: Number },
    deliverymanName: { type: String },
    customerId: { type: String },
    orderItem: [
      {
        id: { type: Number },
        productId: { type: Number },
        product_name: { type: String },
        product_image: { type: String },
        product_address: { type: String },
        product_price: { type: String },
        qty: { type: Number },
      },
    ],
    orderId: { type: Number },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<OrderDocument>("orders", Order);

export default OrderModel;
