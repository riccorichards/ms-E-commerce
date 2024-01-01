import { Channel, Message } from "amqplib";
import CustomerRepo from "../database/repository/customer.repository";
import { CartMessageType } from "../database/types/type.cart";
import { WishlistMessageType } from "../database/types/type.wishlist";
import {
  AddressInputType,
  BankAccountType,
  SessionInputType,
  UpdateAddressInput,
  UpdateBankAccountType,
  UpdateUserInput,
  UploadFileType,
} from "../database/types/types.customer";
import { FeedbackMessageType } from "../database/types/types.feedback";
import { OrderMessageType } from "../database/types/types.order";
import log from "../utils/logger";
import { EventType } from "../database/types/type.event";
import { CreateUserSchemaType } from "../api/middleware/validation/user.validation";

class CustomerService {
  private repository: CustomerRepo;

  constructor() {
    this.repository = new CustomerRepo();
  }

  async SignUp(userInput: CreateUserSchemaType) {
    try {
      const newCustomer = await this.repository.CreateCustomer(userInput);

      if (newCustomer) return newCustomer;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async SessionService(input: SessionInputType, userAgent: string) {
    try {
      return await this.repository.CreateSession(input, userAgent);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async UserAddress(input: AddressInputType) {
    console.log({ input, note: "Service" });
    try {
      const newAddress = await this.repository.AddAddress(input);
      return newAddress
        ? newAddress
        : log.error({ err: "Error with added User address" });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UserBankAcc(input: BankAccountType) {
    try {
      const newAddress = await this.repository.BankAcc(input);
      return newAddress
        ? newAddress
        : log.error({ err: "Error with added User address" });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateUserProfile(_id: string, input: UpdateUserInput) {
    try {
      return await this.repository.UpdateCustomerProfile(_id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateUserAddress(_id: string, input: UpdateAddressInput) {
    try {
      return await this.repository.UpdateCustomerAddress(_id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UpdateUserBankInfo(_id: string, input: UpdateBankAccountType) {
    try {
      return await this.repository.UpdateCustomerBankAcc(_id, input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async UploadProfile(input: UploadFileType) {
    try {
      return await this.repository.UploadProfile(input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async CheckCurrentPasswordService(userId: string, password: string) {
    try {
      return await this.repository.CheckCurrentPassword(userId, password);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async FindCustomer(_id: string) {
    try {
      return await this.repository.FindCustomer(_id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async CustomerData(id: string, fieldToPopulated: string) {
    try {
      const specificData = await this.repository.GetUserSpecificData(
        id,
        fieldToPopulated
      );

      return specificData;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async WishlistItems(input: WishlistMessageType) {
    try {
      return await this.repository.AddWishlistItem(input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async ManageCart(input: CartMessageType) {
    try {
      const addCartItem = await this.repository.AddCartItem(input);
      return addCartItem;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async ManageReview(input: FeedbackMessageType) {
    try {
      const addReviewItem = await this.repository.ManageReviewToProfile(input);
      return addReviewItem;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async ManageOrder(input: OrderMessageType) {
    try {
      const newOrder = await this.repository.AddOrderToProfile(input);

      return newOrder;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async SubscribeEvent(event: EventType, channel: Channel, msg: Message) {
    log.info(
      "========================== Triggering an event ======================"
    );

    try {
      switch (event.type) {
        case "add_product_to_wishlist":
          this.WishlistItems(event.data as WishlistMessageType);
          break;
        case "add_product_to_cart":
          this.ManageCart(event.data as CartMessageType);
          break;
        case "add_order":
          this.ManageOrder(event.data as OrderMessageType);
          break;
        case "add_feedback":
          this.ManageReview(event.data as FeedbackMessageType);
          break;
        case "upload_profile_url":
          this.UploadProfile(event.data as UploadFileType);
        default:
          log.info(`Unhandled event type: ${event.type}`);
      }
      channel.ack(msg);
    } catch (error: any) {
      log.error(`Error processing event: ${error.message}`);
      channel.nack(msg);
    }
  }
}

export default CustomerService;
