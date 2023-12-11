import dotenv from "dotenv";
dotenv.config();

export default {
  port: 8007,
  origin: "http://localhost:",
  message_broker_url: process.env["MESSAGE_BROKER_URL"],
  exchange_name: "exchange_name",
  customer_binding_key: "path_to_customer",
  vendor_binding_key: "path_to_vendor",
  deliveryman_binding_key: "path_to_deliveryman",
  product_binding_key: "path_to_product",
};
