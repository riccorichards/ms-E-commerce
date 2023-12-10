import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "../../config/default";

const createServer = () => {
  const app = express();
  dotenv.config();
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    cors({
      origin: config.get<string>("origin"),
    })
  );
  return app;
};

export default createServer;
