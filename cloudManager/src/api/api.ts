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
    //verifyJWT,
    uploadFile,
    async (req: Request, res: Response) => {
      try {
        const { type, toShare, address } = req.body;
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
              case "foods":
                targetType.targetAddress = "upload_vendor_product";
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
                  title: result.title,
                  userId: targetUser,
                }
              : {
                  title: result.title,
                  userId: targetUser,
                },
        };

        if (Boolean(parseInt(toShare))) {
          if (channel) {
            PublishMessage(
              channel,
              targetType.targetPath,
              JSON.stringify(event)
            );
            PublishMessage(
              channel,
              config.customer_binding_key,
              JSON.stringify({
                type: "update_deliveryman_photo",
                data: { title: result.title, userId: targetUser },
              })
            );
          }
        }

        return res.status(201).json({ ...result, type });
      } catch (error) {
        if (error instanceof MulterError) {
          log.info(error.message);
          return res.status(404).json({ msg: error.message });
        }
        return res.status(500).json("Server Internal Error");
      }
    }
  );

  app.get("/file", async (req: Request, res: Response) => {
    try {
      const title =
        typeof req.query.title === "string" ? req.query.title : null;
      if (!title) return res.status(500).json("Invalid query:" + title);
      const file = await GenerateImageUrl(title);
      if (!file)
        return res
          .status(404)
          .json({ msg: "Error while generating signed url" });

      return res.status(201).json(file.url);
    } catch (error) {
      return res.status(500).json(error);
    }
  });

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

  app.get("/coords", async (req: Request, res: Response) => {
    try {
      const address =
        typeof req.query.address === "string" ? req.query.address : "";
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
