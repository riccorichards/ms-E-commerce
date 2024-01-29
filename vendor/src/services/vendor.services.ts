import { Channel, Message } from "amqplib";
import { EventType } from "../database/types/type.event";
import log from "../utils/logger";
import {
  FeedbackMessageType,
  UpdateFeedbackWithCustomerInfo,
} from "../database/types/types.feedbacks";
import VendorRepo from "../database/repository/vendor.repository";
import {
  CreateVendorSchemaType,
  UpdateVendorSchemaType,
} from "../api/middleware/validation/vendor.validation";
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
  ImageMessageType,
  JustTestUpload,
} from "../database/types/type.imageUrl";
import { MessageOrderType } from "../database/types/type.order";
import { CreateAddressSchemaType } from "../api/middleware/validation/address.validation";

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

  async AddVendorAddressService(
    id: string,
    input: CreateAddressSchemaType["body"]
  ) {
    try {
      return await this.repository.AddVendorAddress(id, input);
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

  async GetVendorOrdersService(id: string, withCustomerInfo: boolean) {
    try {
      return await this.repository.GetVendorOrders(id, withCustomerInfo);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetVendorsFeedsService(vendorId: string, page: number) {
    try {
      return await this.repository.GetVendorsFeeds(vendorId, page);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetTopVendorsService() {
    try {
      return await this.repository.GetTopVendors();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetTopCustomersService(id: string) {
    try {
      return await this.repository.GetTopCustomers(id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetVendorOrderItemsService(id: string, orderId: number) {
    try {
      return await this.repository.GetVendorOrderItems(id, orderId);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async VendorDataService(id: string, amount: number) {
    try {
      const specificData = await this.repository.VendorData(id, amount);

      return specificData;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async DashboardDataService(
    id: string,
    dashboardInput: { field: string; time: string }
  ) {
    try {
      const specificData = await this.repository.GetVendorDashboardData(
        id,
        dashboardInput
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

  async GetFoodsService(vendorId: string) {
    try {
      return await this.repository.GetFoods(vendorId);
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

  async UpdateProfileService(vendorId: string, photoTitle: string) {
    try {
      return await this.repository.UpdateProfile(vendorId, photoTitle);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async FindVendorForOrder(address: string) {
    try {
      return await this.repository.VendorForOrder(address);
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

  async addNewOrderForVendorService(input: MessageOrderType) {
    try {
      return await this.repository.createNewOrder(input);
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

  async uploadVendorGallery(input: ImageMessageType) {
    try {
      return await this.repository.UploadGallery(input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async updateFeedbackWithCustomerInfoService(
    input: UpdateFeedbackWithCustomerInfo
  ) {
    try {
      return await this.repository.updateFeedbackWithCustomerInfo(input);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async updateFoodImageService(input: JustTestUpload) {
    try {
      return await this.repository.updateFoodImage(input);
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

  async deletePhotoService(photo: ImageMessageType) {
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
        case "new_order_for_vendor":
          this.addNewOrderForVendorService(event.data as MessageOrderType);
          break;
        case "update_food_in_vendor":
          this.updatefoodService(event.data as FoodMessageType);
          break;
        case "upload_vendor_profile":
          this.uploadVendorImage(event.data as ImageMessageType);
          break;
        case "upload_vendor_gallery":
          this.uploadVendorGallery(event.data as ImageMessageType);
          break;
        case "upload_vendor_product":
          this.updateFoodImageService(event.data as JustTestUpload);
          break;
        case "update_customer_info":
          this.updateFeedbackWithCustomerInfoService(
            event.data as UpdateFeedbackWithCustomerInfo
          );
          break;
        case "delete_photo_from_gallery":
          this.deletePhotoService(event.data as ImageMessageType);
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
