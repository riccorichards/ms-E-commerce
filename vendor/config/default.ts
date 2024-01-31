import dotenv from "dotenv";
dotenv.config();

export default {
  port: 5000,
  origin: "http://localhost:5173",
  rsaPriviteKey: process.env["RSA_PRIVATE_KEY"],
  rsaPublicKey: process.env["RSA_PUBLIC_KEY"],
  accessTokenTtl: process.env["ACCESS_TOKEN_TIME_TO_LIVE"],
  accessRefreshTtl: process.env["REFRESH_TOKEN_TIME_TO_LIVE"],
  mongo_dev_url: process.env["MONGO_DEVELOPMENT_URL"],
  message_broker_url: process.env["MESSAGE_BROKER_URL"],
  exchange_name: "exchange_name",
  vendor_binding_key: "path_to_vendor",
  customer_binding_key: "path_to_customer",
  deliveryman_binding_key: "path_to_deliveryman",
  vendor_queue: "vendor",
};
