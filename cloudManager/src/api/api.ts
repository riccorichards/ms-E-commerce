import { Application, Request, Response } from "express";
import { verifyJWT } from "./verifyToken";
import { CreateChannel, PublishMessage } from "../utils/rabbitMQ.utils";
import { MulterError } from "multer";
import { v4 as uuid } from "uuid";
import * as geolib from "geolib";

import log from "../utils/logger";
import {
  FileUploadToCloud,
  GenerateImageUrl,
  RemoveFileFromGoogleCloud,
  convertImageToWebP,
} from "../services/upload.service";
import { uploadFile } from "./upload.validation";
import config from "../../config";
import { defineBestDeliveryman } from "../services/mapApi.service";

const api = async (app: Application) => {
  const channel = await CreateChannel();

  app.use(verifyJWT);
  app.post("/upload", uploadFile, async (req: Request, res: Response) => {
    try {
      const { type, isSendToService, address } = req.body;
      const file = req.file;

      const userId = address === "customer" ? req.user?.user : req.user?.vendor;

      console.log(req.user, "<<<<<<<<<<<<<<<< Check the verified token");
      if (!file) return res.status(404).json("File Not Uploaded");
      const webPBuffer = await convertImageToWebP(file);
      const folderName =
        type === "foods"
          ? "foods"
          : type === "profiles"
          ? "profiles"
          : "gallery";
      const originalnameWthoutExtension = file.originalname.replace(
        /.[^/.]+$/,
        ""
      );

      const webExtansion = `${folderName}/${originalnameWthoutExtension}-${uuid()}.webp`;
      await FileUploadToCloud(webPBuffer, webExtansion);

      const result = await GenerateImageUrl(webExtansion);

      const event = {
        type:
          address === "customer"
            ? "upload_profile_url"
            : type === "profiles"
            ? "upload_vendor_profile"
            : "upload_vendor_gallery",
        data:
          type === "gallery"
            ? {
                photo: result,
                userId,
              }
            : {
                url: result.url,
                userId,
              },
      };
      console.log(event, "<<<<<<<<<<<<<<< Inside Cloud");
      if (!Boolean(parseInt(isSendToService))) {
        if (channel) {
          const target =
            address === "customer"
              ? config.customer_binding_key
              : config.vendor_binding_key;

          PublishMessage(channel, target, JSON.stringify(event));
        }
      }

      return res.status(201).json(type === "gallery" ? result : result.url);
    } catch (error) {
      if (error instanceof MulterError) {
        log.info(error.message);
        return res.status(404).json({ msg: error.message });
      }
      return res.status(500).json("Server Internal Error");
    }
  });

  app.post("/nearest-deliveryman", async (req: Request, res: Response) => {
    try {
      return;
    } catch (error) {
      return res.status(500).json(error);
    }
  });

  app.put("/del-photo", async (req: Request, res: Response) => {
    try {
      const title = req.body.title;
      const removedFile = await RemoveFileFromGoogleCloud(title);

      if (!removedFile)
        return res
          .status(404)
          .json({ msg: "Error while removing file from Google Cloud" });

      const userId = req.user?.vendor;

      const event = {
        type: "delete_photo_from_gallery",
        data: {
          title: title,
          userId,
        },
      };

      if (channel) {
        PublishMessage(
          channel,
          config.vendor_binding_key,
          JSON.stringify(event)
        );
      }

      return res.status(201).json({
        title: title,
        msg: `File ===>${removedFile} Successfully Removed...`,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  });
};

export default api;
