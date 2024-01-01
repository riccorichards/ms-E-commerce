import mongoose from "mongoose";
import { WishlistMessageType } from "./type.wishlist";
import { CartMessageType } from "./type.cart";
import { OrderInput } from "./types.order";

// medel for mongodb... schema's part which could recevied from the client side
export interface UserInput {
  username: string;
  email: string;
  password: string;
  image: string;
  isAdmin: boolean;
  bonus: number;
  address: mongoose.Schema.Types.ObjectId;
  bank: mongoose.Schema.Types.ObjectId;
  wishlist: WishlistMessageType[];
  feedback: mongoose.Schema.Types.ObjectId[];
  cart: CartMessageType[];
  order: OrderInput[];
}

//document model for user in mongodb
export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePass(incomingPassword: string): Promise<boolean>;
}

//login type
export interface LoginInputType {
  email: string;
  password: string;
}

//address input type
export interface AddressInputType {
  userId: string;
  postalCode: string;
  street: string;
  city: string;
  country: string;
}

//address document type
export interface AddressDocument extends AddressInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

//for update profile
export interface UpdateUserInput {
  username: string;
  email: string;
  newPassword: string;
}

//for update address
export interface UpdateAddressInput {
  postalCode: string;
  street: string;
  city: string;
  country: string;
}

//bank account input type
export interface BankAccountType {
  userId: string;
  balance: string;
  debit_card: number;
  bankOf: string;
}

//bank account document type
export interface BankAccountDocsType
  extends BankAccountType,
    mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateBankAccountType {
  balance: string;
  debit_card: number;
  bankOf: string;
}

export interface SessionInputType {
  email: string;
  password: string;
}

export interface UploadFileType {
  type: string;
  url: string;
  userId: string;
}
