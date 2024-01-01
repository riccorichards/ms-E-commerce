import dotenv from "dotenv";
dotenv.config();

export default {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbDialect: process.env.DB_DIALECT,
  port: 8002,
  origin: "http://localhost:5173",
  message_broker_url: process.env["MESSAGE_BROKER_URL"],
  exchange_name: "exchange_name",
  product_binding_key: "path_to_product",
  customer_binding_key: "path_to_customer",
  vendor_binding_key: "path_to_vendor",
  product_queue: "product",
};
