import dotenv from "dotenv";
dotenv.config();

export default {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbDialect: process.env.DB_DIALECT,
  port: 8005,
  origin: "http://localhost:3000",
  accessTokenTtl: process.env["ACCESS_TOKEN_TIME_TO_LIFE"],
  refreshTtl: process.env["REFRESH_TOKEN_TIME_TO_LIFE"],
};
