import { Application, Request, Response } from "express";
import { verifyJWT } from "./verifyToken";
import { CreateChannel } from "../utils/rabbitMQ.utils";
import config from "../../config";
import { uploadFile } from "../database/validation/upload.validation";
import { MulterError } from "multer";
import log from "../utils/logger";

const api = async (app: Application) => {
  //const feedService = new FeedService();

  const channel = await CreateChannel();

  app.use(verifyJWT);

  app.post("/upload", uploadFile, async (req: Request, res: Response) => {
    try {
      
    } catch (error) {
      if (error instanceof MulterError) {
        log.info(error.message);
        return res.status(404).json({ msg: error.message });
      }
      return res.status(500).json("Server Internal Error");
    }
  });
};

export default api;
