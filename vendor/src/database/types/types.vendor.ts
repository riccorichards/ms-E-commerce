import mongoose from "mongoose";

interface galleryType {
  image: string;
  cover: string;
}

interface WorkingHrsType {
  workingDays: string;
  weekend: string;
}

// model for mongodb... schema's part which could recevied from the client side
export interface VendorInput {
  name: string;
  ownerName: string;
  about: string;
  pincode: string;
  phone: string;
  email: string;
  password: string;
  workingHrs: WorkingHrsType;
  address: mongoose.Schema.Types.ObjectId;
  teamMember: mongoose.Schema.Types.ObjectId;
  gallery: [galleryType];
  socialMedia: [{ title: string }];
}

//document model for user in mongodb
export interface VendorDocument extends VendorInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePass(incomingPassword: string): Promise<boolean>;
}

//login type
export interface LoginInputType {
  email: string;
  password: string;
}

//for update profile
export interface UpdateVendorInput {
  name: string;
  ownerName: string;
  about: string;
  pincode: string;
  phone: string;
  email: string;
  password: string;
}
