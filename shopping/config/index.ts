import dotenv from "dotenv";
dotenv.config();

export default {
  orm_type: "postgres",
  host: process.env.HOST,
  bgPort: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 8003,
  origin: "http://localhost:5173",
  message_broker_url: process.env["MESSAGE_BROKER_URL"],
  exchange_name: "exchange_name",
  customer_binding_key: "path_to_customer",
  vendor_binding_key: "path_to_vendor",
  deliveryman_binding_key: "path_to_deliveryman",
};
