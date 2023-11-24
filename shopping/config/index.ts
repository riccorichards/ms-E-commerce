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
  origin: "http://localhost:3000",
};
