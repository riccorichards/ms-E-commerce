import mongoose from "mongoose";
import { SubCategoryDocument } from "../types/types.subCategory";

const sub_category = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    mainCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Main_category",
    },
  },
  { timestamps: true }
);

const SubCategoryModal = mongoose.model<SubCategoryDocument>(
  "Sub_category",
  sub_category
);

export default SubCategoryModal;
