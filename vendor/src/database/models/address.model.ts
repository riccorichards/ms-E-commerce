import mongoose from "mongoose";
import { AddressDocument } from "../types/type.address";

const address = new mongoose.Schema(
  {
    street: { type: String },
    postalCode: { type: String },
    city: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model<AddressDocument>("address", address);

export default AddressModel;
