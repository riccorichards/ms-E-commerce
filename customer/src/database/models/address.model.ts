import mongoose from "mongoose";
import { AddressDocument } from "../types/types.customer";

const address = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    street: { type: String },
    postalCode: { type: String },
    city: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model<AddressDocument>("Address", address);

export default AddressModel;
