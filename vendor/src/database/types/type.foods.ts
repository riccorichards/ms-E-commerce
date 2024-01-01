import mongoose from "mongoose";

export interface FoodMessageType {
  title: string;
  desc: string;
  price: string;
  image: string;
  discount: number;
  forVendor: string;
  foodId: number;
}

export interface FoodsDocument extends FoodMessageType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
