import mongoose from "mongoose";

export interface GalleryInputType {
  url: string;
  title: string;
}

export interface GalleryDocument extends GalleryInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
