import mongoose from "mongoose";

export interface AddressInputType {
  postalCode: string;
  street: string;
  city: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface AddressDocument extends AddressInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
