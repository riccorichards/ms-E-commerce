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
import {
  convertAddressToCoords,
  convertAddressesToCoords,
  defineBestDeliveryman,
} from "../services/mapApi.service";

const api = async (app: Application) => {
  const channel = await CreateChannel();

  app.post(
    "/upload",
    verifyJWT,
    uploadFile,
    async (req: Request, res: Response) => {
      try {
        const { type, isSendToService, address } = req.body;
        const file = req.file;

        let targetUser;
        switch (address) {
          case "customer":
            targetUser = req.user?.user;
            break;
          case "vendor":
            targetUser = req.user?.vendor;
            break;
          case "deliveryman":
            targetUser = req.user?.deliverymanId;
        }
        console.log({ targetUser }, "<<<<<<<<<<< User type");
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

        const targetType = { targetAddress: "", targetPath: "" };
        switch (address) {
          case "customer":
            targetType.targetAddress = "upload_profile_url";
            targetType.targetPath = config.customer_binding_key;
            break;
          case "vendor":
            switch (type) {
              case "profiles":
                targetType.targetAddress = "upload_vendor_profile";
                targetType.targetPath = config.vendor_binding_key;
                break;
              case "gallery":
                targetType.targetAddress = "upload_vendor_gallery";
                targetType.targetPath = config.vendor_binding_key;
                break;
            }
            break;
          case "deliveryman":
            targetType.targetAddress = "upload_deliveryman_profile";
            targetType.targetPath = config.deliveryman_binding_key;
            break;
        }

        const event = {
          type: targetType.targetAddress,
          data:
            type === "gallery"
              ? {
                  photo: result,
                  targetUser,
                }
              : {
                  url: result.url,
                  userId: targetUser,
                },
        };

        if (!Boolean(parseInt(isSendToService))) {
          if (channel) {
            PublishMessage(
              channel,
              targetType.targetPath,
              JSON.stringify(event)
            );
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
    }
  );

  app.put("/del-photo", verifyJWT, async (req: Request, res: Response) => {
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

  app.post("/top-nearest-persons", async (req: Request, res: Response) => {
    try {
      const addresses = req.body;
      if (!addresses)
        return res
          .status(400)
          .json({ msg: "vendor addresses are not defined" });

      const convertedAddresses = await convertAddressesToCoords(addresses);

      if (!convertedAddresses)
        return res.status(500).json({
          msg: "Error while convertion process:" + convertedAddresses,
        });

      const result = await defineBestDeliveryman(convertedAddresses);

      if (!result)
        return res.status(500).json({
          msg: "Error while defining the nearest person:" + result,
        });

      return res.status(201).json(result.slice(0, 3));
    } catch (error) {
      return res.status(500).json(error);
    }
  });

  app.get("/coords/:address", async (req: Request, res: Response) => {
    try {
      const address = req.params.address;
      if (address) {
        const result = await convertAddressToCoords(address);

        if (result) return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  });
};

export default api;
