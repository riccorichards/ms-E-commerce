import mongoose from "mongoose";
import { GalleryDocument } from "../types/type.gallery";

const gallery = new mongoose.Schema(
  {
    title: { type: String },
    userId: { type: String },
    url: { type: String },
  },
  { timestamps: true }
);

const GalleryModel = mongoose.model<GalleryDocument>("gallery", gallery);

export default GalleryModel;
