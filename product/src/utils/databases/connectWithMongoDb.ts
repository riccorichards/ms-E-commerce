import mysql from "mysql2";
import config from "config";
import dotenv from "dotenv";
import log from "../logger";
import mongoose from "mongoose";

dotenv.config();

const mongo_connection = async () => {
  const mongo_Url = config.get<string>("mongo_url");
  try {
    await mongoose.connect(mongo_Url);
    log.info("Connected with mongoDb at locally...");
  } catch (error: any) {
    log.error(error.message);
    process.exit(1);
  }
};

export default mongo_connection;
