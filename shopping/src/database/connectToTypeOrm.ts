import { DataSource } from "typeorm";
import Order from "./entities/order.entity";
import Shipping from "./entities/shipping.entity";
import OrderItem from "./entities/orderItem.entity";
import Address from "./entities/address.entity";
import Transaction from "./entities/transaction.entity";
import Payment from "./entities/payment.entity";
import config from "../../config";

export const appDataSource = new DataSource({
  host: config.host,
  type: config.orm_type as "postgres",
  port: 5432,
  password: config.password,
  username: config.username,
  database: config.database,
  entities: [Order, Shipping, OrderItem, Address, Transaction, Payment],
  synchronize: true,
  logging: false,
});
