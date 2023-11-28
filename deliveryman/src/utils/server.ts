import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import api from "../api/api";
import { connectToMySQL } from "../database/connectToSequelize";
import config from "../../config";
const createServer = () => {
  const app = express();
  dotenv.config();
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: config.origin,
    })
  );

  connectToMySQL();
  api(app);
  return app;
};

export default createServer;
