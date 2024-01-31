import ShoppingRepo from "../database/repository/shopping.repository";
import {
  OrderInputValidation,
  ShippingInputValidation,
} from "../api/validation/shopping.validation";
import log from "../utils/logger";
import { Channel, Message } from "amqplib";

interface EventType {
  type: string;
  data: {
    userId: string;
    updatedImage: string;
    updatedUsername: string;
    updatedEmail: string;
    updatedAddress: string;
  };
}

export interface MessageType {
  userId: string;
  updatedImage: string;
  updatedUsername: string;
  updatedEmail: string;
  updatedAddress: string;
}
class ShoppingService {
  private shoppingRepo: ShoppingRepo;

  constructor(shoppingRepo: ShoppingRepo) {
    this.shoppingRepo = shoppingRepo;
  }

  async CreateOrderService(orderInput: OrderInputValidation) {
    try {
      return await this.shoppingRepo.CreateOrderRepo(orderInput);
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async CreateShippingService(shippingInput: ShippingInputValidation) {
    try {
      return await this.shoppingRepo.CreateShippingRepo(shippingInput);
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async GetOrdersListService(customerId: string, page: number | undefined) {
    try {
      return await this.shoppingRepo.GetOrdersList(customerId, page);
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async GetOrdersDataService() {
    try {
      return await this.shoppingRepo.GetOrdersData();
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async GetTopCustomersService() {
    try {
      return await this.shoppingRepo.GetTopCustomers();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetOrdersByDeliveryNameService(name: string) {
    try {
      return await this.shoppingRepo.GetOrdersByDeliveryName(name);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetOrdersService() {
    try {
      return await this.shoppingRepo.GetOrders();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async GetPopularFoodsService() {
    try {
      return await this.shoppingRepo.GetPopularFoods();
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async GetOrderByIdService(orderId: number) {
    try {
      return await this.shoppingRepo.GetOrderById(orderId);
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async CancelOrderService(orderId: number) {
    try {
      return await this.shoppingRepo.CancelOrder(orderId);
    } catch (error: any) {
      log.error(error.message);
    }
  }
}

export default ShoppingService;
