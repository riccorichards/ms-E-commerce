import mongoose from "mongoose";
import { OrderDocsType } from "../types/types.order";

const items = new mongoose.Schema(
  {
    productId: { type: Number },
    qty: { type: Number },
    price: { type: String },
  },
  { timestamps: true }
);

const ItemsModel = mongoose.model<OrderDocsType>("Items", items);

export default ItemsModel;
