import mongoose from "mongoose";

export interface OrderItemType {
  id: number;
  productId: number;
  product_name: string;
  product_image: string;
  product_address: string;
  product_price: string;
  qty: string;
}

export interface OrderType {
  order_status: string;
  total_amount: number;
  deliverymanName: string;
  customerId: string;
  orderItem: OrderItemType[];
  orderId: number;
}

export interface MessageOrderType {
  order: OrderType;
  vendor_address: string;
}

export interface OrderDocument extends OrderType, mongoose.Document {
  createdAt: Date;
}
