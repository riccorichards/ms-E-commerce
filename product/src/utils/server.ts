import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import api from "../api/api";
import { connectToMySQL } from "../database/connectToSequelize";
import config from "../../config";
import { CreateChannel } from "./rabbitMQ.utils";
import log from "./logger";

const createServer = async () => {
  const app = express();
  dotenv.config();
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: config.origin,
      credentials: true,
    })
  );

  connectToMySQL();

  const channel = await CreateChannel();

  if (!channel) {
    log.error("Failed to create RabbitMQ channel. Exiting...");
    process.exit(1);
  }
  api(app, channel);

  return app;
};

export default createServer;
