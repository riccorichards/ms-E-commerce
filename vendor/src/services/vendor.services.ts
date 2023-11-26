import CustomerRepo from "../database/repository/vendor.repository";
import { AddressInputType } from "../database/types/type.address";
import { TeamMemberType } from "../database/types/type.teamMember";
import {
  LoginInputType,
  UpdateVendorInput,
  VendorInput,
} from "../database/types/types.vendor";
import log from "../utils/logger";

class CustomerService {
  private repository: CustomerRepo;

  constructor() {
    this.repository = new CustomerRepo();
  }

  async SignUp(vendorInput: VendorInput) {
    try {
      const newVendor = await this.repository.CreateVendor(vendorInput);
      if (newVendor) return newVendor;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async SessionService(input: LoginInputType, userAgent: string) {
    try {
      return await this.repository.CreateSession(input, userAgent);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async VendorAddress(vendorId: string, input: AddressInputType) {
    try {
      const newAddress = await this.repository.AddAddress(vendorId, input);
      return newAddress
        ? newAddress
        : log.error({ err: "Error with added User address" });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async TeamMembers(vendorId: string, input: TeamMemberType) {
    try {
      const newAddress = await this.repository.TeamMembers(vendorId, input);
      return newAddress;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateVendorProfile(id: string, input: UpdateVendorInput) {
    try {
      return await this.repository.UpdateVendorProfile(id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateVendorAddress(id: string, input: AddressInputType) {
    try {
      return await this.repository.UpdateVendorAddress(id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateUpdateTeamMember(id: string, input: TeamMemberType) {
    try {
      return await this.repository.UpdateTeamMember(id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async FindVendor(id: string) {
    try {
      return await this.repository.FindVendor(id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async VendorData(id: string, fieldToPopulated: string) {
    try {
      const specificData = await this.repository.GetVendorSpecificData(
        id,
        fieldToPopulated
      );

      return specificData;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetAllvendors() {
    try {
      return await this.repository.GetAllVendor();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetGallery(id: string) {
    try {
      return await this.repository.GetGallery(id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
}

export default CustomerService;
