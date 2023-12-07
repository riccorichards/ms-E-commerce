import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import config from "config";
import cors from "cors";

const createServer = () => {
  const app = express();
  dotenv.config();
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    cors({
      origin: config.get<string>("origin"),
      credentials: true,
    })
  );
  return app;
};

export default createServer;
