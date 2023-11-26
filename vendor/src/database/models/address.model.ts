import mongoose from "mongoose";
import { AddressDocument } from "../types/type.address";

const address = new mongoose.Schema(
  {
    street: { type: String },
    postalCode: { type: String },
    city: { type: String },
    country: { type: String },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model<AddressDocument>("address", address);

export default AddressModel;
