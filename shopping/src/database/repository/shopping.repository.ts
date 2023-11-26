import { Repository } from "typeorm";
import Order from "../entities/order.entity";
import OrderItem from "../entities/orderItem.entity";
import log from "../../utils/logger";
import Shipping from "../entities/shipping.entity";
import Address from "../entities/address.entity";
import Transaction from "../entities/transaction.entity";
import Payment from "../entities/payment.entity";
import {
  AddressInputValidation,
  OrderInputValidation,
  OrderItemInputValidation,
  PaymentInputValidation,
  ShippingInputValidation,
  TransactionInputValidation,
} from "../validation/shopping.validation";

class ShoppingRepo {
  constructor(
    private orderRepository: Repository<Order>,
    private orderItemRepository: Repository<OrderItem>,
    private shippingRepository: Repository<Shipping>,
    private addressRepository: Repository<Address>,
    private transactionRepository: Repository<Transaction>,
    private paymentRepository: Repository<Payment>
  ) {}

  //creation operations
  async CreateOrderRepo(orderInput: OrderInputValidation) {
    try {
      const newOrder = this.orderRepository.create(orderInput);
      await this.orderRepository.save(newOrder);
      return newOrder;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async CreateOrderItemRepo(
    orderId: number,
    orderItem: OrderItemInputValidation[]
  ) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ["orderItem"],
      });

      if (!order) {
        throw new Error("Order not found");
      }
      let total = 0;
      for (const item of orderItem) {
        total += parseFloat(item.price) * item.qty;
        const orderItem = this.orderItemRepository.create({
          ...item,
          order: { id: orderId },
        });
        await this.orderItemRepository.save(orderItem);
        order.orderItem.push(orderItem);
        order.total_amount = `$ ${total.toFixed(2)}`;
      }
      await this.orderRepository.save(order);

      return order;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async CreateShippingRepo(shippingInput: ShippingInputValidation) {
    try {
      const newShipping = this.shippingRepository.create(shippingInput);
      await this.shippingRepository.save(newShipping);

      return newShipping;
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async CreateAddressRepo(
    shippingId: number,
    addressInput: AddressInputValidation
  ) {
    try {
      const shipping = await this.shippingRepository.findOne({
        where: { id: shippingId },
        relations: ["address"],
      });

      if (!shipping) {
        throw new Error("Shipping not Found");
      }

      const newAddress = this.addressRepository.create({
        ...addressInput,
        shipping: { id: shippingId },
      });

      await this.addressRepository.save(newAddress);

      shipping.address = newAddress;

      await this.shippingRepository.save(shipping);

      return shipping;
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async CreateTransactionRepo(
    orderId: number,
    transactionInput: TransactionInputValidation
  ) {
    try {
      const order = await this.orderRepository.findOneBy({ id: orderId });
      const newTnx = this.transactionRepository.create({
        ...transactionInput,
        total_amount: order?.total_amount,
      });
      await this.transactionRepository.save(newTnx);

      return newTnx;
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async CreatePaymentRepo(paymentInput: PaymentInputValidation) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: paymentInput.orderId },
        relations: ["orderItem"],
      });
      const transaction = await this.transactionRepository.findOneBy({
        id: paymentInput.transactionId,
      });

      if (!order || !transaction) {
        throw new Error("Error while creating a new payment");
      }

      const newPayment = this.paymentRepository.create({
        order: order,
        transaction: transaction,
        ...paymentInput,
      });

      await this.paymentRepository.save(newPayment);

      return newPayment;
    } catch (error: any) {
      log.error(error.message);
    }
  }

  //get operations
  async ReturnAllPayments() {
    try {
      return await this.paymentRepository.find({
        relations: ["order", "transaction"],
      });
    } catch (error: any) {
      log.error(error.message);
    }
  }

  async ReturnPaymentById(id: number) {
    try {
      return await this.paymentRepository.findOne({
        where: { id },
        relations: ["order", "transaction"],
      });
    } catch (error: any) {
      log.error(error.message);
    }
  }
  
}

export default ShoppingRepo;
