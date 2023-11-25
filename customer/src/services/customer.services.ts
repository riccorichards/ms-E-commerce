import CustomerRepo from "../database/repository/customer.repository";
import { CartType } from "../database/types/type.cart";
import { WishlistType } from "../database/types/type.wishlist";
import {
  AddressInputType,
  LoginInputType,
  UpdateAddressInput,
  UpdateUserInput,
  UserInput,
} from "../database/types/types.customer";
import { OrderInput } from "../database/types/types.order";
import { ReviewInput } from "../database/types/types.productReview";
import log from "../utils/logger";

class CustomerService {
  private repository: CustomerRepo;

  constructor() {
    this.repository = new CustomerRepo();
  }

  async SignUp(userInput: UserInput) {
    try {
      const newCustomer = await this.repository.CreateCustomer(userInput);

      if (newCustomer) return newCustomer;
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

  async UserAddress(input: AddressInputType) {
    try {
      const newAddress = await this.repository.AddAddress(input);
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

  async WishlistItems(id: string, input: WishlistType) {
    try {
      const addWishlistItem = await this.repository.AddWishlistItem(id, input);

      return addWishlistItem;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async ManageCart(id: string, input: CartType) {
    try {
      const addCartItem = await this.repository.AddCartItem(id, input);
      return addCartItem;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async ManageReview(id: string, input: ReviewInput) {
    try {
      const addReviewItem = await this.repository.AddReviewToProfile(id, input);
      return addReviewItem;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async ManageOrder(id: string, input: OrderInput) {
    try {
      const newOrder = await this.repository.AddOrderToProfile(id, input);

      return newOrder;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
}

export default CustomerService;
