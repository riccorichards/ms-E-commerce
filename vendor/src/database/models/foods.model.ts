import mongoose from "mongoose";
import { FoodsDocument } from "../types/type.foods";

const foods = new mongoose.Schema(
  {
    title: { type: String },
    desc: { type: String },
    price: { type: String },
    image: { type: String },
    discount: { type: Number },
    foodId: { type: Number },
  },
  { timestamps: true }
);

const FoodsModel = mongoose.model<FoodsDocument>("foods", foods);

export default FoodsModel;
