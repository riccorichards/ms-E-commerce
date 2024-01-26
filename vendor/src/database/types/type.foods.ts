import mongoose from "mongoose";

export interface FoodMessageType {
  title: string;
  desc: string;
  price: string;
  image: string;
  url: string | null;
  discount: number;
  forVendor: string;
  foodId: number;
}

export interface FoodsDocument extends FoodMessageType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
