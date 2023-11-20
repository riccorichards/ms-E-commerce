import mongoose from "mongoose";
import { MainCategoryDocument } from "./types.mainCategory";

export interface subCagetoryInput {
  title: string;
  desc: string;
  mainCategoryId: MainCategoryDocument["_id"];
}

export interface SubCategoryDocument
  extends subCagetoryInput,
    mongoose.Document {
  createAt: Date;
  updateAt: Date;
}
