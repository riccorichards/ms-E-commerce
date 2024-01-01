import mongoose from "mongoose";

interface WorkingHrsType {
  workingDays: string;
  weekend: string;
}

// model for mongodb... schema's part which could recevied from the client side
export interface VendorType {
  name: string;
  ownerName: string;
  about: string;
  pincode: string;
  phone: string;
  image: string;
  rating: number;
  email: string;
  password: string;
  workingHrs: WorkingHrsType;
  address: mongoose.Schema.Types.ObjectId;
  feeds: mongoose.Schema.Types.ObjectId[];
  foods: mongoose.Schema.Types.ObjectId[];
  teamMember: mongoose.Schema.Types.ObjectId[];
  gallery: mongoose.Schema.Types.ObjectId[];
  socialMedia: { title: string; url: string }[];
}

//document model for user in mongodb
export interface VendorDocument extends VendorType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePass(incomingPassword: string): Promise<boolean>;
}

//login type
export interface LoginInputType {
  email: string;
  password: string;
}
