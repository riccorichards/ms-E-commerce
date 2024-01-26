import mongoose from "mongoose";
import { FoodsDocument } from "../types/type.foods";

const foods = new mongoose.Schema(
  {
    title: { type: String },
    desc: { type: String },
    price: { type: String },
    image: { type: String },
    url: { type: String, default: null },
    discount: { type: Number },
    foodId: { type: Number },
    forVendor: { type: String },
  },
  { timestamps: true }
);

const FoodsModel = mongoose.model<FoodsDocument>("foods", foods);

export default FoodsModel;
