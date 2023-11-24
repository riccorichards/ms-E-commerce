import { appDataSource } from "../connectToTypeOrm";
import Address from "../entities/address.entity";
import Order from "../entities/order.entity";
import OrderItem from "../entities/orderItem.entity";
import Payment from "../entities/payment.entity";
import Shipping from "../entities/shipping.entity";
import Transaction from "../entities/transaction.entity";

const orderRepository = appDataSource.getRepository(Order);
const orderIteRepository = appDataSource.getRepository(OrderItem);
const shippingRepository = appDataSource.getRepository(Shipping);
const addressRepository = appDataSource.getRepository(Address);
const transactionRepository = appDataSource.getRepository(Transaction);
const paymentRepository = appDataSource.getRepository(Payment);

export default {
  orderIteRepository,
  orderRepository,
  shippingRepository,
  addressRepository,
  transactionRepository,
  paymentRepository,
};
