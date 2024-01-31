import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import api from "../api/api";
import config from "../../config";

const createServer = () => {
  const app = express();
  dotenv.config();
  //based on this server handle the process of uploading files we need to define some limit, in that case 1mb
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: config.origin,
      credentials: true,
    })
  );

  api(app);
  return app;
};

export default createServer;
