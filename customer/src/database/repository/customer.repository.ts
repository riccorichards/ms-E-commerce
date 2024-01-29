import AddressModel from "../models/address.model";
import UserModel from "../models/user.model";
import {
  AddressInputType,
  BankAccountType,
  PopulateAddress,
  SessionInputType,
  UpdateAddressInput,
  UpdateBankAccountType,
  UpdateUserInput,
  UploadFileType,
  UserDocument,
} from "../types/types.customer";
import log from "../../utils/logger";
import { WishlistMessageType } from "../types/type.wishlist";
import { CartMessageType } from "../types/type.cart";
import SessionModel from "../models/session.model";
import { omit } from "lodash";
import BankModel from "../models/bank.model";
import { CreateUserSchemaType } from "../../api/middleware/validation/user.validation";
import bcrypt from "bcrypt";
import FeedbackModel from "../models/feedback.model";
import {
  makeRequestWithRetries,
  takeUrl,
} from "../../utils/makeRequestWithRetries";
import {
  FeedbackMessageType,
  UpdateFeedbackWithDaliverymanPhotoMessage,
} from "../types/type.feedback";

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
      const user = await UserModel.findOne({ email: input.email })
        .populate("address")
        .populate("bank");

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
      const result = {
        user,
        newSession,
      };
      return result;
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
      if (input.newPassword) {
        const password = input?.newPassword;
        const salt = await bcrypt.genSalt(13);
        const hash = await bcrypt.hash(password, salt);

        return await UserModel.findByIdAndUpdate(
          query,
          { ...input, password: hash },
          { new: true }
        );
      } else {
        const updatedCustomerInfo = await UserModel.findByIdAndUpdate(
          query,
          input,
          { new: true }
        );
        if (!updatedCustomerInfo)
          throw new Error("Error while updating customer info");
        const image = await takeUrl(updatedCustomerInfo.image);
        updatedCustomerInfo.url = image;

        const customerFeedbacks = await FeedbackModel.find({ userId: query });

        await Promise.all(
          customerFeedbacks.map(async (feed) => {
            feed.author = updatedCustomerInfo.username;
            feed.authorImg = updatedCustomerInfo.image;

            return await feed.save();
          })
        );
        return updatedCustomerInfo;
      }
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

  async CheckCurrentPassword(query: string, password: string) {
    try {
      const profile = await UserModel.findById(query);
      console.log({ password, note: "Repo" });
      const result = await profile?.comparePass(password);
      console.log({ result, note: "Repo" });
      return result;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async UploadProfile(input: UploadFileType) {
    try {
      const profile = await UserModel.findById(input.userId);

      if (!profile) throw new Error("Customer not found");

      profile.image = input.title;

      await profile.save();

      return profile;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async UpdateFeedWithDeliverymanPhoto(
    input: UpdateFeedbackWithDaliverymanPhotoMessage
  ) {
    try {
      const feedbacks = await FeedbackModel.find({ targetId: input.userId });

      if (!feedbacks) throw new Error("Feedbacks not found");

      return await Promise.all(
        feedbacks.map(async (feed) => {
          feed.targetImg = input.title;
          return await feed.save();
        })
      );
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async FindCustomer(id: string) {
    try {
      const profile = await UserModel.findById(id)
        .populate("address")
        .populate("bank");

      if (!profile) throw new Error("Profile was not found");
      if (profile.isAdmin) {
        return profile;
      }

      const image = await takeUrl(profile.image);

      profile.url = image;
      return profile;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async GetCustomerInfoById(customerId: string) {
    try {
      const profile = await UserModel.findById(customerId).populate("address");

      if (!profile) throw new Error("Profile was not found");

      const profileAddress = profile.address as PopulateAddress;

      const image = await takeUrl(profile.image);
      console.log(profile);
      const customerOrderInfo = {
        username: profile.username,
        address: profileAddress.street,
        email: profile.email,
        image: image,
      };
      return customerOrderInfo;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async GetCustomersLength() {
    try {
      const customers = (await UserModel.find()).length;

      if (!customers) throw new Error("Profile was not found");

      return customers;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async CustomerFeeds(id: string, page: number | string) {
    try {
      if (typeof page === "number") {
        const limit = 7;
        const skip = (page - 1) * limit;
        const totalFeeds = (await FeedbackModel.find({ userId: id })).length;
        const customerFeeds = await FeedbackModel.find({ userId: id })
          .sort({ feedId: -1 })
          .skip(skip)
          .limit(limit);

        if (!customerFeeds) {
          throw new Error("Not found feeds or data is not available");
        }
        const feedResult = await Promise.all(
          customerFeeds.map(async (feed) => {
            const authorImage = await takeUrl(feed.authorImg);
            const targetImage = await takeUrl(feed.targetImg);
            feed.authorImg = authorImage;
            feed.targetImg = targetImage;

            return feed;
          })
        );
        const totalPages = Math.ceil(totalFeeds / limit);
        const pagination = {
          page,
          totalPages,
          pageSize: limit,
          totalCount: totalFeeds,
        };
        return { feedResult, pagination };
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

      const result = await Promise.all(
        wishlist.map(async (item) => {
          const image = await takeUrl(item.image);
          item.image = image;

          return item;
        })
      );

      profile.wishlist = result;

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

      const result = await Promise.all(
        cart.map(async (item) => {
          const image = await takeUrl(item.image);
          item.url = image;

          return item;
        })
      );

      profile.cart = result;

      const savedProfile = await profile.save();
      return savedProfile.cart;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async AddOrderAndMakeCartEmpty(userId: string) {
    try {
      const profile = await UserModel.findById(userId);

      if (!profile) throw new Error("Error with find User");

      profile.cart = [];

      const savedProfile = await profile.save();

      return savedProfile;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async ManageReviewToProfile(input: FeedbackMessageType) {
    try {
      const profile = await UserModel.findById(input.userId);
      if (!profile) throw new Error("Error with find User");

      if (!Boolean(await FeedbackModel.findOne({ feedId: input.feedId }))) {
        const newFeedback = await FeedbackModel.create(input);

        if (!newFeedback)
          throw new Error("Error while creating a new feed in repo");

        profile.feedback.push(newFeedback._id);

        await profile.save();

        return profile;
      } else {
        const existingFeed = await FeedbackModel.findOne({
          feedId: input.feedId,
        });
        profile.feedback = profile.feedback.filter(
          (feed) => feed.toString() !== existingFeed?._id.toString()
        );

        await profile.save();

        await FeedbackModel.findByIdAndDelete(existingFeed?._id);

        return profile;
      }
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }
}

export default CustomerRepo;
