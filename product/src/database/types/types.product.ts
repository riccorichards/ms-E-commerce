import mongoose from "mongoose";
import { SubCategoryDocument } from "./types.subCategory";

export interface ProductInput {
  title: string;
  desc: string;
  image: string | null;
  price: number;
  discount: number | null;
  shopping: number | null;
  subCategoryId: SubCategoryDocument["_id"];
}

export interface ProductDocument extends ProductInput, mongoose.Document {
  createAt: Date;
  updateAt: Date;
}
