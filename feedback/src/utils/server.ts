import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import api from "../api/api";
import config from "../../config";
import { appDataSource } from "../database/connectToTypeOrm";
import log from "./logger";

const createServer = () => {
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
  appDataSource
    .initialize()
    .then(() => log.info({ msg: "Data Source has been initialized!" }))
    .catch((err) =>
      log.error({ msg: "Error during Data Source initialization", err: err })
    );
  api(app);
  return app;
};

export default createServer;
