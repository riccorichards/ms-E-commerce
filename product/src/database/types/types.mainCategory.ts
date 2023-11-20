import mongoose from "mongoose";

export interface MainCatInput {
  title: string;
  desc: string;
}

export interface MainCategoryDocument extends MainCatInput, mongoose.Document {
  createAt: Date;
  updateAt: Date;
}
