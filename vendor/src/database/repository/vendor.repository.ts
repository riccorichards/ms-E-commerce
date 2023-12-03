import AddressModel from "../models/address.model";
import UserModel from "../models/vendor.model";
import {
  LoginInputType,
  UpdateVendorInput,
  VendorDocument,
  VendorInput,
} from "../types/types.vendor";
import log from "../../utils/logger";
import SessionModel from "../models/session.model";
import { omit } from "lodash";
import VendorModel from "../models/vendor.model";
import { AddressInputType } from "../types/type.address";
import { TeamMemberType } from "../types/type.teamMember";
import TeamModel from "../models/teamMember.model";
import { FeedbackMessageType } from "../types/types.feedbacks";
import FeedsModel from "../models/feedback.model";
import mongoose from "mongoose";

class VendorRepo {
  async CreateVendor(input: VendorInput) {
    try {
      const newVendor = await VendorModel.create({
        ...input,
        address: null,
        teamMember: null,
        feeds: [],
        gallery: [],
        socialMedia: [],
      });

      return newVendor;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async CreateSession(input: LoginInputType, userAgent: string) {
    try {
      const vendor = await UserModel.findOne({ email: input.email });

      if (!vendor) {
        throw new Error("Wrong credentials");
      }

      const validPass = await vendor.comparePass(input.password);

      if (!validPass) {
        throw new Error("Wrong credentials");
      }

      const newSession = await SessionModel.create({
        vendor: vendor._id,
        userAgent,
      });

      return newSession;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async AddAddress(vendorId: string, input: AddressInputType) {
    try {
      const vendor = (await VendorModel.findById(vendorId)) as VendorDocument;
      const newAddress = await AddressModel.create(input);

      if (!newAddress) throw new Error("Error while creating a new address");

      const savedAddress = await newAddress.save();

      vendor.address = omit(savedAddress.toJSON(), "vendorId")._id;

      return await vendor.save();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async TeamMembers(vendorId: string, input: TeamMemberType) {
    try {
      const vendor = (await VendorModel.findById(vendorId)) as VendorDocument;

      const newTeamMember = await TeamModel.create(input);

      if (!newTeamMember)
        throw new Error("Error while creating a new team member");

      const result = await newTeamMember.save();

      vendor.teamMember = omit(result.toJSON(), "vendorId")._id;

      return await vendor.save();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateVendorProfile(query: string, input: UpdateVendorInput) {
    try {
      return await VendorModel.findByIdAndUpdate(query, input, { new: true });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateVendorAddress(query: string, input: AddressInputType) {
    try {
      const profile = await VendorModel.findById(query);
      const updatedAddress = await AddressModel.findByIdAndUpdate(
        profile?.address,
        input,
        { new: true }
      );
      if (!updatedAddress)
        throw new Error("Error while updating the vendor's address");
      return updatedAddress;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateTeamMember(query: string, input: TeamMemberType) {
    try {
      const profile = await VendorModel.findById(query);
      const updatedTeamMember = await TeamModel.findByIdAndUpdate(
        profile?.teamMember,
        input,
        { new: true }
      );
      if (!updatedTeamMember)
        throw new Error("Error while updating the vendor's team member");
      return updatedTeamMember;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async FindVendor(id: string) {
    try {
      return await VendorModel.findById(id)
        .populate("address")
        .populate("team")
        .populate("feeds");
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetAllVendor() {
    try {
      return await VendorModel.find({})
        .populate("address")
        .populate("teamMember")
        .populate("feeds")
        .lean();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetVendorSpecificData(id: string, fieldToPopulated: string) {
    try {
      const field = fieldToPopulated.toLowerCase();
      const vendor = await VendorModel.findById(id).populate(field);

      if (!vendor) {
        throw new Error("Vendor not found");
      }
      return vendor;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetGallery(id: string) {
    try {
      return await VendorModel.findById(id)
        .populate("address")
        .populate("teamMember")
        .populate("feeds")
        .lean();
    } catch (error: any) {
      throw new Error("Error while fetching vendor's gallery");
    }
  }

  async createNewFeeds(input: FeedbackMessageType) {
    try {
      const newFeedback = await FeedsModel.create(input);
      if (!newFeedback) throw new Error("Error while creating a new feeds");

      const savedFeeds = await newFeedback.save();
      const vendor = (await VendorModel.findById(
        input.forVendor
      )) as VendorDocument;
      if (!vendor) throw new Error("Error while finding the vendor");

      vendor.feeds.push(savedFeeds._id);

      return await vendor.save();
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }
  async updateFeeds(input: FeedbackMessageType) {
    try {
      const feedId = input.feedId;
      const updatedFeedback = await FeedsModel.findOneAndUpdate(
        { feedId: feedId },
        input,
        {
          new: true,
        }
      );

      return updatedFeedback;
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }
  async deleteFeedsFromVendor(feedId: number) {
    try {
      console.log({ feedId, note: "Vendor Repo" });

      const removedFeed = await FeedsModel.findOneAndRemove({ feedId: feedId });
      return removedFeed;
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }
}

export default VendorRepo;
