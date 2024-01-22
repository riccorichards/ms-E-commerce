import { appDataSource } from "../connectToTypeOrm";
import Order from "../entities/order.entity";
import OrderItem from "../entities/orderItem.entity";
import Invoice from "../entities/invoice.entity";
import Shipping from "../entities/shipping.entity";

const orderRepository = appDataSource.getRepository(Order);
const orderIteRepository = appDataSource.getRepository(OrderItem);
const shippingRepository = appDataSource.getRepository(Shipping);
const invoiceRepository = appDataSource.getRepository(Invoice);

export default {
  orderIteRepository,
  orderRepository,
  shippingRepository,
  invoiceRepository,
};
