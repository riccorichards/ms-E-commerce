import mongoose from "mongoose";
import { MainCategoryDocument } from "../types/types.mainCategory";

const main_catgory = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
  },
  { timestamps: true }
);

const MainCategoryModal = mongoose.model<MainCategoryDocument>(
  "Main_category",
  main_catgory
);

export default MainCategoryModal;
