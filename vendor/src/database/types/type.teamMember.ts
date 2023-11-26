import mongoose from "mongoose";

export interface TeamMemberType {
  name: string;
  description: string;
  image: string;
  position: string;
}

export interface TeamDocs extends TeamMemberType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
