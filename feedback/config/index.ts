import dotenv from "dotenv";
dotenv.config();

export default {
  orm_type: "postgres",
  host: process.env.HOST,
  bgPort: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 8006,
  origin: "http://localhost:3000",
  message_broker_url: process.env["MESSAGE_BROKER_URL"],
  exchange_name: "customer_exchange",
  customer_binding_key: "path_to_customer",
  vendor_binding_key: "path_to_vendor",
  deliveryman_binding_key: "path_to_deliveryman",
  product_binding_key: "path_to_product",
};
