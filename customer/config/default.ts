import dotenv from "dotenv";
dotenv.config();

export default {
  port: 8001,
  origin: "http://localhost:5173",
  rsaPriviteKey: process.env["RSA_PRIVATE_KEY"],
  rsaPublicKey: process.env["RSA_PUBLIC_KEY"],
  mongo_dev_url: process.env["MONGO_DEVELOPMENT_URL"],
  message_broker_url: process.env["MESSAGE_BROKER_URL"],
  exchange_name: "customer_exchange",
  product_binding_key: "path_to_customer",
  customer_queue: "customer",
};
