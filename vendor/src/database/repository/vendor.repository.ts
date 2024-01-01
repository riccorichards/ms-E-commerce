import AddressModel from "../models/address.model";
import UserModel from "../models/vendor.model";
import { VendorDocument } from "../types/types.vendor";
import SessionModel from "../models/session.model";
import { omit } from "lodash";
import VendorModel from "../models/vendor.model";
import TeamModel from "../models/teamMember.model";
import { FeedbackMessageType } from "../types/types.feedbacks";
import FeedsModel from "../models/feedback.model";
import {
  CreateVendorSchemaType,
  UpdateVendorSchemaType,
} from "../../api/middleware/validation/vendor.validation";
import ErrorHandler from "./repoErrorHandler";
import { CreateSessionSchemaType } from "../../api/middleware/validation/session.validation";
import {
  CreateAddressSchemaType,
  UpdateAddressSchemaType,
} from "../../api/middleware/validation/address.validation";
import {
  CreateTeamMemberSchemaType,
  UpdateTeamMemberSchemaType,
} from "../../api/middleware/validation/team.validation";
import {
  BioValidationType,
  workingDaysValidationType,
} from "../../api/middleware/validation/additional.validation";
import { AddSocialUrlType } from "../../api/middleware/validation/socialUrls.validation";
import { URL } from "node:url";
import FoodsModel from "../models/foods.model";
import { FoodMessageType } from "../types/type.foods";
import {
  GalleryMessageType,
  ImageMessageType,
  RemovePhotoMsg,
} from "../types/type.imageUrl";
import GalleryModel from "../models/gallery.model";

class VendorRepo {
  async CreateVendor(input: CreateVendorSchemaType) {
    try {
      const newVendor = await VendorModel.create({
        ...input,
        about: null,
        rating: 0,
        workingHrs: null,
        address: null,
        teamMember: null,
        feeds: [],
        gallery: [],
        socialMedia: [],
      });

      if (!newVendor) throw new Error("Error while creating a new vendor...");
      return newVendor;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async CreateSession(
    input: CreateSessionSchemaType["body"],
    userAgent: string
  ) {
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

      if (!newSession) throw new Error("Error while creating a new session");

      return { vendor, newSession };
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async AddAddress(vendorId: string, input: CreateAddressSchemaType["body"]) {
    try {
      const vendor = (await VendorModel.findById(vendorId)) as VendorDocument;

      const newAddress = await AddressModel.create(input);

      if (!newAddress)
        throw new Error("Error while creating a new address => (Repo)");

      const savedAddress = await newAddress.save();

      vendor.address = omit(savedAddress.toJSON(), "vendorId")._id;
      await vendor.save();
      return newAddress;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async TeamMembers(
    vendorId: string,
    input: CreateTeamMemberSchemaType["body"]
  ) {
    try {
      const vendor = (await VendorModel.findById(vendorId)) as VendorDocument;
      const newTeamMember = await TeamModel.create(input);
      if (!newTeamMember)
        throw new Error("Error while creating a new team member");

      const result = await newTeamMember.save();

      vendor.teamMember.push(omit(result.toJSON(), "vendorId")._id);

      await vendor.save();
      return newTeamMember;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async RemoveMember(vendorId: string, memberId: string) {
    try {
      const vendor = await VendorModel.findById(vendorId);
      if (!vendor) throw new Error("Error while finding the vendor");

      vendor.teamMember = vendor.teamMember.filter(
        (member) => member.toString() !== memberId.toString()
      );

      await vendor.save();
      const removedMember = await TeamModel.findByIdAndDelete(memberId);
      return removedMember;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UpdateVendorProfile(
    query: string,
    input: CreateVendorSchemaType["body"]
  ) {
    try {
      return await VendorModel.findByIdAndUpdate(query, input, { new: true });
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UpdateVendorAddress(
    query: string,
    input: UpdateAddressSchemaType["body"]
  ) {
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
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UpdateTeamMember(
    query: string,
    input: UpdateTeamMemberSchemaType["body"]
  ) {
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
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async AddBioToVendor(vendorId: string, input: BioValidationType["body"]) {
    try {
      const vendor = await VendorModel.findById(vendorId);
      if (!vendor) throw new Error("Vendor not found");

      vendor.about = input.bio;

      await vendor.save();
      return input.bio;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async AddWorkingHrs(
    vendorId: string,
    input: workingDaysValidationType["body"]
  ) {
    try {
      const vendor = await VendorModel.findById(vendorId);
      if (!vendor) throw new Error("Vendor Not Found");
      vendor.workingHrs = input;
      await vendor.save();
      return input;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UploadImage(input: ImageMessageType) {
    try {
      const vendor = await VendorModel.findById(input.userId);
      if (!vendor) throw new Error("Vendor Not Found");
      vendor.image = input.url;
      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UploadGallery(input: GalleryMessageType) {
    try {
      const vendor = await VendorModel.findById(input.userId);
      if (!vendor) throw new Error("Vendor Not Found");
      const { url, title } = input.photo;
      const addNewGallertPhoto = await GalleryModel.create({ url, title });
      vendor.gallery.push(addNewGallertPhoto._id);

      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async UpdateBioInVendor(vendorId: string, input: BioValidationType["body"]) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) throw new Error("Vendor not found");
      vendor.about = input.bio;
      return omit((await vendor.save()).toJSON(), "password");
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetAdditionalInfo(vendorId: string) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) throw new Error("Vendor not found");

      return { about: vendor.about, workingHrs: vendor.workingHrs };
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async AddSocialUrl(vendorId: string, input: AddSocialUrlType["body"]) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) throw new Error("Vendor not found");

      let domain = new URL(input.url).hostname;

      if (domain.split(".").length > 2) {
        domain = domain.split(".")[1];
      } else if (domain.split(".").length <= 2) {
        domain = domain.split(".")[0];
      }

      const readyForStore = {
        title: domain,
        url: input.url,
      };

      vendor.socialMedia.push(readyForStore);

      await vendor.save();
      return readyForStore;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async RemoveSocialUrl(vendorId: string, title: string) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) throw new Error("Vendor not found");

      vendor.socialMedia = vendor.socialMedia.filter(
        (url) => url.title !== title
      );

      await vendor.save();
      return vendor.socialMedia;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async FindVendor(id: string) {
    try {
      return await VendorModel.findById(id)
        .populate("address")
        .populate({
          path: "teamMember",
          options: { sort: { createdAt: -1 } },
        })
        .populate({
          path: "feeds",
          options: { sort: { createdAt: -1 } },
        })
        .populate({
          path: "foods",
          options: { sort: { createdAt: -1 } },
        })
        .populate({
          path: "gallery",
          options: { sort: { createdAt: -1 } },
        });
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetAllVendor() {
    try {
      const result = await VendorModel.find({}).populate("address").lean();
      return result.map((vendor) => {
        return {
          name: vendor.name,
          _id: vendor._id,
          address: vendor.address,
          email: vendor.email,
          phone: vendor.phone,
          image: vendor.image,
          workingHrs: vendor.workingHrs,
          rating: vendor.rating,
          socialUrls: vendor.socialMedia,
        };
      });
    } catch (error) {
      ErrorHandler(error);
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
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async GetGallery(vendorId: string) {
    try {
      const vendor = await VendorModel.findById(vendorId)
        .populate({
          path: "gallery",
          options: { sort: { createdAt: -1 } },
        })
        .lean();

      if (!vendor) throw new Error("Error retrieve gallery");

      return vendor.gallery;
    } catch (error) {
      ErrorHandler(error);
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
    } catch (error) {
      ErrorHandler(error);
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
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async deleteFeedsFromVendor(feedId: number) {
    try {
      const removedFeed = await FeedsModel.findOneAndRemove({ feedId: feedId });
      return removedFeed;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async deletePhotoFromVendorGallery(photo: RemovePhotoMsg) {
    try {
      const vendor = await VendorModel.findById(photo.userId);

      if (!vendor) throw new Error("Vendor not found");

      const existingPhoto = await GalleryModel.findOne({ title: photo.title });

      if (!existingPhoto) throw new Error("Photo not found");

      await GalleryModel.findOneAndRemove({
        title: photo.title,
      });

      vendor.gallery = vendor.gallery.filter(
        (el) => el.toString() !== existingPhoto._id.toString()
      );

      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async createFood(input: FoodMessageType) {
    try {
      const newFood = await FoodsModel.create(input);
      if (!newFood) throw new Error("Error while creating a new feeds");

      const savedFood = await newFood.save();
      const vendor = (await VendorModel.findById(
        input.forVendor
      )) as VendorDocument;
      if (!vendor) throw new Error("Error while finding the vendor");

      vendor.foods.push(savedFood._id);

      return await vendor.save();
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async updateFood(input: FoodMessageType) {
    try {
      const foodId = input.foodId;
      const updatedFood = await FoodsModel.findOneAndUpdate(
        { foodId: foodId },
        input,
        {
          new: true,
        }
      );

      return updatedFood;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async updateVendor(vendorId: string, input: UpdateVendorSchemaType["body"]) {
    try {
      const updatedVendor = await VendorModel.findByIdAndUpdate(
        vendorId,
        input,
        {
          new: true,
        }
      );
      if (!updatedVendor) throw new Error("Error while updating a vendor");
      return omit(updatedVendor?.toJSON, "password");
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async deleteFoodFromVendor(foodId: number) {
    try {
      const removedFood = await FoodsModel.findOneAndRemove({ foodId: foodId });
      return removedFood;
    } catch (error) {
      ErrorHandler(error);
    }
  }
}

export default VendorRepo;
