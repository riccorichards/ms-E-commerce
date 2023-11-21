import dotenv from "dotenv";
dotenv.config();

export default {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbDialect: process.env.DB_DIALECT,
  port: 8002,
  origin: "http://localhost:3000",
};
