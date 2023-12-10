import AddressModel from "../models/address.model";
import UserModel from "../models/user.model";
import {
  AddressInputType,
  BankAccountType,
  SessionInputType,
  UpdateAddressInput,
  UpdateBankAccountType,
  UpdateUserInput,
  UserDocument,
} from "../types/types.customer";
import log from "../../utils/logger";
import { WishlistMessageType } from "../types/type.wishlist";
import { CartMessageType } from "../types/type.cart";
import { OrderMessageType } from "../types/types.order";
import { FeedbackMessageType } from "../types/types.feedback";
import SessionModel from "../models/session.model";
import { omit } from "lodash";
import BankModel from "../models/bank.model";
import { CreateUserSchemaType } from "../../api/middleware/validation/user.validation";

class CustomerRepo {
  async CreateCustomer(input: CreateUserSchemaType) {
    try {
      const newCustomer = await UserModel.create({
        ...input,
        bonus: 0,
        address: null,
        bank: null,
        wishlist: [],
        feedback: [],
        cart: [],
        order: [],
      });

      return newCustomer;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async CreateSession(input: SessionInputType, userAgent: string) {
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

  async CheckValidUser(userId: string) {
    try {
      const result = await SessionModel.findOne({ user: userId });
      if (!result) throw new Error("Error while looking session");
      return result.valid;
    } catch (error) {
      if (error instanceof Error) {
        log.error({ err: error.message });
        throw new Error(error.message);
      }
      throw error;
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
      throw error;
    }
  }

  async BankAcc(input: BankAccountType) {
    try {
      const { userId, balance, debit_card, bankOf } = input;
      const user = (await UserModel.findById(userId)) as UserDocument;

      const newBankAccount = await BankModel.create({
        userId,
        balance,
        debit_card,
        bankOf,
      });

      if (!newBankAccount) return false;

      const savedAddress = await newBankAccount.save();

      user.bank = omit(savedAddress.toJSON(), "userId")._id;

      return await user.save();
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async UpdateCustomerProfile(query: string, input: UpdateUserInput) {
    try {
      return await UserModel.findByIdAndUpdate(query, input, { new: true });
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async UpdateCustomerBankAcc(query: string, input: UpdateBankAccountType) {
    try {
      const profile = await UserModel.findById(query);
      const updatedBankAcc = await BankModel.findByIdAndUpdate(
        profile?.bank,
        input,
        { new: true }
      );
      if (!updatedBankAcc) throw new Error("Error while update bank info");
      return updatedBankAcc;
    } catch (error: any) {
      throw new Error(error.message);
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
      throw error;
    }
  }

  async FindCustomer(id: string) {
    try {
      return await UserModel.findById(id).populate("address").populate("bank");
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
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
        case "feedback":
          return customer.feedback;
        case "wishlist":
          return customer.wishlist;
        default:
          throw new Error("Invalid field requested");
      }
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async AddWishlistItem(input: WishlistMessageType) {
    try {
      const { userId } = input;
      const profile = await UserModel.findById(userId).populate("wishlist");

      if (!profile) throw new Error("Error with find user");

      const wishlist = profile.wishlist as WishlistMessageType[];

      const isExist = wishlist.some((item) => item.id === input.id);
      if (isExist) {
        const index = wishlist.findIndex((item) => item.id === input.id);
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

  async AddCartItem(input: CartMessageType) {
    try {
      const profile = await UserModel.findById(input.userId);

      if (!profile) throw new Error("Error with find User");

      const cart = profile.cart as CartMessageType[];

      const index = cart.findIndex(
        (item) => item.id.toString() === input.id.toString()
      );

      if (index !== -1) {
        if (input.unit > 0) {
          cart[index].unit = input.unit;
        } else {
          const index = cart.findIndex((item) => item.id === input.id);
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
      throw error;
    }
  }

  async AddOrderToProfile(input: OrderMessageType) {
    try {
      const profile = await UserModel.findById(input.userId);

      if (!profile) throw new Error("Error with find User");

      if (profile.order == undefined) {
        profile.order = [];
      }

      profile.order.push(input);

      profile.cart = [];

      const savedProfile = await profile.save();

      return savedProfile;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async AddReviewToProfile(input: FeedbackMessageType) {
    try {
      const profile = await UserModel.findById(input.userId);

      if (!profile) throw new Error("Error with find User");

      const review = profile.feedback as FeedbackMessageType[];

      const index = review.findIndex((r) => r.feedId === input.feedId);

      if (index !== -1) {
        if (
          review[index].rating !== input.rating ||
          review[index].review !== input.review
        ) {
          review[index].rating = input.rating;
          review[index].review = input.review;
          console.log({ msg: "what the fuck im here" });
        } else {
          review.splice(index, 1);
        }
      } else {
        review.push(input);
      }

      profile.feedback = review;

      const savedProfile = await profile.save();

      return savedProfile;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }
}

export default CustomerRepo;
