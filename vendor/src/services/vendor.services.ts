import { Channel, Message } from "amqplib";
import { AddressInputType } from "../database/types/type.address";
import { EventType } from "../database/types/type.event";
import { TeamMemberType } from "../database/types/type.teamMember";
import {
  LoginInputType,
  UpdateVendorInput,
  VendorInput,
} from "../database/types/types.vendor";
import log from "../utils/logger";
import { FeedbackMessageType } from "../database/types/types.feedbacks";
import VendorRepo from "../database/repository/vendor.repository";

class VendorService {
  private repository: VendorRepo;

  constructor() {
    this.repository = new VendorRepo();
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
  async deleteFeedbacksService(feedId: number) {
    try {
      return await this.repository.deleteFeedsFromVendor(feedId);
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(error.message);
    }
  }

  async SubscribeEvent(event: EventType, channel: Channel, msg: Message) {
    log.info(
      "========================== Triggering an event ======================"
    );
    console.log(event.data, "Vendor Event");
    try {
      switch (event.type) {
        case "add_feed_in_vendor":
          this.createFeedbacksService(event.data);
          break;
        case "update_feed_in_vendor":
          this.updateFeedbacksService(event.data);
          break;
        case "remove_feed_from_vendor":
          this.deleteFeedbacksService(event.data.feedId);
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
