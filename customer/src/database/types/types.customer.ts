import mongoose from "mongoose";
import { WishlistType } from "./type.wishlist";
import { CartType } from "./type.cart";
import { ReviewInput } from "./types.productReview";
import { OrderInput } from "./types.order";

// medel for mongodb... schema's part which could recevied from the client side
export interface UserInput {
  username: string;
  email: string;
  password: string;
  balance: string;
  debit_card: number;
  bonus: number;
  address: mongoose.Schema.Types.ObjectId;
  wishlist: WishlistType[];
  review: ReviewInput[];
  cart: CartType[];
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
  password: string;
  balance: string;
  debit_card: number;
}

//for update address
export interface UpdateAddressInput {
  postalCode: string;
  street: string;
  city: string;
  country: string;
}
