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

class VendorRepo {
  async CreateVendor(input: VendorInput) {
    try {
      const newVendor = await VendorModel.create({
        ...input,
        address: null,
        teamMember: null,
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
        .populate("team");
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetAllVendor() {
    try {
      return await VendorModel.find({})
        .populate("address")
        .populate("teamMember")
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
      return await VendorModel.findById(id);
    } catch (error: any) {
      throw new Error("Error while fetching vendor's gallery");
    }
  }
}

export default VendorRepo;
