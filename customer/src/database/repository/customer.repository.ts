import AddressModel from "../models/address.model";
import UserModel from "../models/user.model";
import {
  AddressInputType,
  LoginInputType,
  UpdateAddressInput,
  UpdateUserInput,
  UserDocument,
  UserInput,
} from "../types/types.customer";
import log from "../../utils/logger";
import { WishlistType } from "../types/type.wishlist";
import { CartType } from "../types/type.cart";
import { OrderInput } from "../types/types.order";
import { ReviewInput } from "../types/types.productReview";
import SessionModel from "../models/session.model";
import { omit } from "lodash";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import SessionDocument from "../types/types.session";

class CustomerRepo {
  async CreateCustomer(input: UserInput) {
    try {
      const newCustomer = await UserModel.create({
        ...input,
        bonus: 0,
        address: null,
        wishlist: [],
        cart: [],
        order: [],
      });

      return newCustomer;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async CreateSession(input: LoginInputType, userAgent: string) {
    try {
      const user = await UserModel.findOne({ email: input.email });

      if (!user) {
        throw new Error("Wrong credentials");
      }

      const validPass = await user.comparePass(input.password);

      if (!validPass) {
        throw new Error("Wrong credentials");
      }

      const newSession = await SessionModel.create({
        user: user._id,
        userAgent,
      });

      return newSession;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async AddAddress(input: AddressInputType) {
    try {
      const { userId, street, postalCode, city, country } = input;
      const user = (await UserModel.findById(userId)) as UserDocument;

      const newAddress = await AddressModel.create({
        userId,
        street,
        postalCode,
        city,
        country,
      });

      if (!newAddress) return false;

      const savedAddress = await newAddress.save();

      user.address = omit(savedAddress.toJSON(), "userId")._id;

      return await user.save();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateCustomerProfile(query: string, input: UpdateUserInput) {
    try {
      return await UserModel.findByIdAndUpdate(query, input, { new: true });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateCustomerAddress(query: string, input: UpdateAddressInput) {
    try {
      const profile = await UserModel.findById(query);
      const updatedAddress = await AddressModel.findByIdAndUpdate(
        profile?.address,
        input,
        { new: true }
      );
      if (!updatedAddress) return log.error("Something wents wrong");
      return updatedAddress;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async FindCustomer(id: string) {
    try {
      return await UserModel.findById(id).populate("address");
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetUserSpecificData(id: string, fieldToPopulated: string) {
    try {
      const field = fieldToPopulated.toLowerCase();
      const customer = await UserModel.findById(id);

      if (!customer) {
        throw new Error("Customer not found");
      }

      switch (field) {
        case "cart":
          return customer.cart;
        case "order":
          return customer.order;
        case "review":
          return customer.review;
        case "wishlist":
          return customer.wishlist;
        default:
          throw new Error("Invalid field requested");
      }
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async AddWishlistItem(id: string, input: WishlistType) {
    try {
      const profile = await UserModel.findById(id).populate("wishlist");

      if (!profile) return false;

      const wishlist = profile.wishlist as WishlistType[];

      const isExist = wishlist.some((item) => item._id === input._id);

      if (isExist) {
        const index = wishlist.findIndex((item) => item._id === input._id);
        wishlist.splice(index, 1);
      } else {
        wishlist.push(input);
      }

      profile.wishlist = wishlist;
      const savedProfile = await profile.save();
      return savedProfile.wishlist;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async AddCartItem(id: string, input: CartType) {
    try {
      const profile = await UserModel.findById(id);

      if (!profile) return log.error("Error with find User");

      const cart = profile.cart as CartType[];

      const index = cart.findIndex(
        (item) => item.product._id.toString() === input.product._id.toString()
      );

      if (index !== -1) {
        if (input.unit > 0) {
          cart[index].unit = input.unit;
        } else {
          const index = cart.findIndex(
            (item) => item.product._id === input.product._id
          );
          cart.splice(index, 1);
        }
      } else {
        cart.push(input);
      }

      profile.cart = cart;

      const savedProfile = await profile.save();

      return savedProfile.cart;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async AddOrderToProfile(id: string, input: OrderInput) {
    try {
      const profile = await UserModel.findById(id);

      if (!profile) return log.error("Error with find User");

      if (profile.order == undefined) {
        profile.order = [];
      }

      profile.order.push(input);

      profile.cart = [];

      const savedProfile = await profile.save();

      return savedProfile;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async AddReviewToProfile(id: string, input: ReviewInput) {
    try {
      const profile = await UserModel.findById(id);

      if (!profile) return log.error("Error with find User");

      const review = profile.review as ReviewInput[];

      review.push(input);

      profile.review = review;

      const savedProfile = await profile.save();

      return savedProfile;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
}

export default CustomerRepo;
