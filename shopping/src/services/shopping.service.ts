import ShoppingRepo from "../database/repository/shopping.repository";
import {
  AddressInputValidation,
  OrderInputValidation,
  OrderItemInputValidation,
  PaymentInputValidation,
  ShippingInputValidation,
  TransactionInputValidation,
} from "../database/validation/shopping.validation";
import log from "../utils/logger";

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

  async CreateOrderItemService(
    orderId: number,
    orderItemInput: OrderItemInputValidation[]
  ) {
    try {
      return await this.shoppingRepo.CreateOrderItemRepo(
        orderId,
        orderItemInput
      );
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

  async CreateTransactionService(
    orderId: number,
    transactioInput: TransactionInputValidation
  ) {
    try {
      return await this.shoppingRepo.CreateTransactionRepo(
        orderId,
        transactioInput
      );
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async CreatePayloadService(paymentInput: PaymentInputValidation) {
    try {
      return await this.shoppingRepo.CreatePaymentRepo(paymentInput);
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async GetAllPaymentsService() {
    try {
      return await this.shoppingRepo.ReturnAllPayments();
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async GetPaymentByIdService(id: number) {
    try {
      return await this.shoppingRepo.ReturnPaymentById(id);
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async AddVendorInfoService(id: number) {
    try {
      return await this.shoppingRepo.ReturnPaymentById(id);
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async AddDeliverymanInfoService(id: number) {
    try {
      return await this.shoppingRepo.ReturnPaymentById(id);
    } catch (error: any) {
      log.error(error.message);
    }
  }
}

export default ShoppingService;
