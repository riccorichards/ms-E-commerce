import { DataSource } from "typeorm";
import Order from "./entities/order.entity";
import Shipping from "./entities/shipping.entity";
import OrderItem from "./entities/orderItem.entity";
import Address from "./entities/address.entity";
import Transaction from "./entities/transaction.entity";
import config from "../../config";
import Invoice from "./entities/invoice.entity";
import Deliveryman from "./entities/deliveryman.entity";
import Vendor from "./entities/vendor.entity";

export const appDataSource = new DataSource({
  host: config.host,
  type: config.orm_type as "postgres",
  port: 5432,
  password: config.password,
  username: config.username,
  database: config.database,
  entities: [
    Order,
    Shipping,
    OrderItem,
    Address,
    Transaction,
    Invoice,
    Deliveryman,
    Vendor,
  ],
  synchronize: true,
  logging: false,
});
