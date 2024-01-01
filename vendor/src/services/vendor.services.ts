import { Channel, Message } from "amqplib";
import { AddressInputType } from "../database/types/type.address";
import { EventType } from "../database/types/type.event";
import { TeamMemberType } from "../database/types/type.teamMember";
import { LoginInputType } from "../database/types/types.vendor";
import log from "../utils/logger";
import { FeedbackMessageType } from "../database/types/types.feedbacks";
import VendorRepo from "../database/repository/vendor.repository";
import {
  CreateVendorSchemaType,
  UpdateVendorSchemaType,
} from "../api/middleware/validation/vendor.validation";
import {
  CreateAddressSchemaType,
  UpdateAddressSchemaType,
} from "../api/middleware/validation/address.validation";
import { CreateSessionSchemaType } from "../api/middleware/validation/session.validation";
import {
  CreateTeamMemberSchemaType,
  UpdateTeamMemberSchemaType,
} from "../api/middleware/validation/team.validation";
import { AddSocialUrlType } from "../api/middleware/validation/socialUrls.validation";
import { FoodMessageType } from "../database/types/type.foods";
import {
  BioValidationType,
  workingDaysValidationType,
} from "../api/middleware/validation/additional.validation";
import {
  GalleryMessageType,
  ImageMessageType,
  RemovePhotoMsg,
} from "../database/types/type.imageUrl";

class VendorService {
  private repository: VendorRepo;

  constructor() {
    this.repository = new VendorRepo();
  }

  async SignUp(vendorInput: CreateVendorSchemaType) {
    try {
      const newVendor = await this.repository.CreateVendor(vendorInput);
      if (newVendor) return newVendor;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async SessionService(
    input: CreateSessionSchemaType["body"],
    userAgent: string
  ) {
    try {
      return await this.repository.CreateSession(input, userAgent);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async VendorAddress(
    vendorId: string,
    input: CreateAddressSchemaType["body"]
  ) {
    try {
      const newAddress = await this.repository.AddAddress(vendorId, input);
      return newAddress
        ? newAddress
        : log.error({ err: "Error with added User address" });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async TeamMembers(
    vendorId: string,
    input: CreateTeamMemberSchemaType["body"]
  ) {
    try {
      const newAddress = await this.repository.TeamMembers(vendorId, input);
      return newAddress;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async RemoveMemberService(vendorId: string, memberId: string) {
    try {
      const updatedVendorMembers = await this.repository.RemoveMember(
        vendorId,
        memberId
      );
      return updatedVendorMembers;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateVendorProfile(id: string, input: CreateVendorSchemaType["body"]) {
    try {
      return await this.repository.UpdateVendorProfile(id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateVendorAddress(
    id: string,
    input: UpdateAddressSchemaType["body"]
  ) {
    try {
      return await this.repository.UpdateVendorAddress(id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateUpdateTeamMember(
    id: string,
    input: UpdateTeamMemberSchemaType["body"]
  ) {
    try {
      return await this.repository.UpdateTeamMember(id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async AddAdditionalInfoService(id: string, input: BioValidationType["body"]) {
    try {
      return await this.repository.AddBioToVendor(id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateAdditionalInfoService(
    id: string,
    input: BioValidationType["body"]
  ) {
    try {
      return await this.repository.UpdateBioInVendor(id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetAdditionalInfoService(id: string) {
    try {
      return await this.repository.GetAdditionalInfo(id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async AddSocialUrlService(id: string, input: AddSocialUrlType["body"]) {
    try {
      return await this.repository.AddSocialUrl(id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async RemoveSocialUrlService(vendorId: string, title: string) {
    try {
      return await this.repository.RemoveSocialUrl(vendorId, title);
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

  async GetGallery(vendorId: string) {
    try {
      return await this.repository.GetGallery(vendorId);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async createFeedbacksService(input: FeedbackMessageType) {
    try {
      return await this.repository.createNewFeeds(input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async updateFeedbacksService(input: FeedbackMessageType) {
    try {
      return await this.repository.updateFeeds(input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async addWorkingHrsService(
    vendorId: string,
    input: workingDaysValidationType["body"]
  ) {
    try {
      return await this.repository.AddWorkingHrs(vendorId, input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async uploadVendorImage(input: ImageMessageType) {
    try {
      return await this.repository.UploadImage(input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async uploadVendorGallery(input: GalleryMessageType) {
    try {
      return await this.repository.UploadGallery(input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async deleteFeedbacksService(feedId: number) {
    try {
      return await this.repository.deleteFeedsFromVendor(feedId);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async deletePhotoService(photo: RemovePhotoMsg) {
    try {
      return await this.repository.deletePhotoFromVendorGallery(photo);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async createFoodService(input: FoodMessageType) {
    try {
      return await this.repository.createFood(input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async updateVendorService(
    vendorId: string,
    input: UpdateVendorSchemaType["body"]
  ) {
    try {
      return await this.repository.updateVendor(vendorId, input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async updatefoodService(input: FoodMessageType) {
    try {
      return await this.repository.updateFood(input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async deletefoodService(foodId: number) {
    try {
      return await this.repository.deleteFoodFromVendor(foodId);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async SubscribeEvent(event: EventType, channel: Channel, msg: Message) {
    log.info(
      "========================== Triggering an event ======================"
    );
    console.log(
      event,
      "<<<<<<<<<<<<, Inside Event ====> check what event we getting"
    );
    try {
      switch (event.type) {
        case "add_feed_in_vendor":
          this.createFeedbacksService(event.data as FeedbackMessageType);
          break;
        case "update_feed_in_vendor":
          this.updateFeedbacksService(event.data as FeedbackMessageType);
          break;
        case "remove_feed_from_vendor":
          const feed = event.data as FeedbackMessageType;
          this.deleteFeedbacksService(feed.feedId);
          break;
        case "add_food_in_vendor":
          this.createFoodService(event.data as FoodMessageType);
          break;
        case "update_food_in_vendor":
          this.updatefoodService(event.data as FoodMessageType);
          break;
        case "upload_vendor_profile":
          this.uploadVendorImage(event.data as ImageMessageType);
          break;
        case "upload_vendor_gallery":
          this.uploadVendorGallery(event.data as GalleryMessageType);
          break;
        case "delete_photo_from_gallery":
          this.deletePhotoService(event.data as RemovePhotoMsg);
          break;
        case "delete_food_in_vendor":
          const food = event.data as FoodMessageType;
          this.deletefoodService(food.foodId);
          break;
        default:
          log.info(`Unhandled event type: ${event.type}`);
      }
      channel.ack(msg);
    } catch (error: any) {
      log.info(`Error while Subscribe events: ${error.messge}`);
      channel.nack(msg);
    }
  }
}

export default VendorService;
