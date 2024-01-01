import mongoose from "mongoose";
import { GalleryDocument } from "../types/type.gallery";

const gallery = new mongoose.Schema(
  {
    url: { type: String },
    title: { type: String },
  },
  { timestamps: true }
);

const GalleryModel = mongoose.model<GalleryDocument>("gallery", gallery);

export default GalleryModel;
