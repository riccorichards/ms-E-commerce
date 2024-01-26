import mongoose from "mongoose";

export interface GalleryInputType {
  title: string;
  userId: string;
  url: string | null;
}

export interface GalleryDocument extends GalleryInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
