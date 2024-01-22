import { DataSource } from "typeorm";
import Order from "./entities/order.entity";
import Shipping from "./entities/shipping.entity";
import OrderItem from "./entities/orderItem.entity";
import config from "../../config";
import Invoice from "./entities/invoice.entity";

export const appDataSource = new DataSource({
  host: config.host,
  type: config.orm_type as "postgres",
  port: 5432,
  password: config.password,
  username: config.username,
  database: config.database,
  entities: [Order, Shipping, OrderItem, Invoice],
  synchronize: true,
  dropSchema: false,
  logging: false,
});
