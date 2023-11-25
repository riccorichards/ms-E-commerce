import dotenv from "dotenv";
dotenv.config();

export default {
  port: 5000,
  origin: "http://localhost:3000",
  rsaPriviteKey: process.env["RSA_PRIVATE_KEY"],
  rsaPublicKey: process.env["RSA_PUBLIC_KEY"],
  accessTokenTtl: process.env["ACCESS_TOKEN_TIME_TO_LIVE"],
  accessRefreshTtl: process.env["REFRESH_TOKEN_TIME_TO_LIVE"],
  mongo_dev_url: process.env["MONGO_DEVELOPMENT_URL"],
};
