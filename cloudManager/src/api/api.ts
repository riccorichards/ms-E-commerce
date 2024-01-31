import { Application, Request, Response } from "express";
import { verifyJWT } from "./verifyToken";
import { CreateChannel, PublishMessage } from "../utils/rabbitMQ.utils";
import { MulterError } from "multer";
import { v4 as uuid } from "uuid";

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
import Utils from "../utils/utils";

const api = async (app: Application) => {
  const channel = await CreateChannel();

  //upload handler
  app.post(
    "/upload",
    verifyJWT, // middleware to verify the JWT token
    uploadFile, // middleware to handle the image size and type
    async (req: Request, res: Response) => {
      try {
        const { type, toShare, address } = req.body;
        const file = req.file;

        if (!file || !address || !type)
          return res
            .status(404)
            .json("File Not Uploaded or address is not define");

        // converting incoming file into webp for small splace in GCP
        const webPBuffer = await convertImageToWebP(file);

        //remove extension
        const originalnameWthoutExtension = file.originalname.replace(
          /.[^/.]+$/,
          ""
        );
        //add extention ====>> originalname + uuid + webp
        const webExtansion = `${Utils.defineFolderName(
          type
        )}/${originalnameWthoutExtension}-${uuid()}.webp`;

        // send file to the GCP (storage)
        await FileUploadToCloud(webPBuffer, webExtansion);
        // generate signed url from GCP
        const result = await GenerateImageUrl(webExtansion);

        //creting event for Publish messages
        const event = {
          type: Utils.defineDiretion(address, type)?.targetAddress,
          data: {
            title: result.title,
            userId: Utils.defineUser(address, req),
          },
        };
        // toShate keywork help us to define file needs to send via RabbitMQ or not, if it is 0(false) that means the file needs to send back to the client and the client will keep the title of image with another information
        if (Boolean(parseInt(toShare))) {
          if (channel) {
            PublishMessage(
              channel,
              Utils.defineDiretion(address, type)?.targetPath || "",
              JSON.stringify(event)
            );
            PublishMessage(
              channel,
              config.customer_binding_key,
              JSON.stringify({
                type: "update_deliveryman_photo",
                data: {
                  title: result.title,
                  userId: Utils.defineUser(address, req),
                },
              })
            );
          }
        }

        return res.status(201).json({ ...result, type });
      } catch (error) {
        //if there is any kind of error, we first check is this error cames from MulterError
        if (error instanceof MulterError) {
          log.info(error.message);
          return res.status(404).json({ msg: error.message });
        }
        // or there is some issue with server
        return res.status(500).json("Server Internal Error");
      }
    }
  );

  //return singed url to the clinet
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

  //removing file from everywhere
  app.put("/del-photo", verifyJWT, async (req: Request, res: Response) => {
    try {
      const title = req.body.title;
      //remove file from GCP
      const removedFile = await RemoveFileFromGoogleCloud(title);

      if (!removedFile)
        return res
          .status(404)
          .json({ msg: "Error while removing file from Google Cloud" });

      //take user Id => it is always vendor and the removed file is only gallery file, so id is always belong to vendors
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

  //define the nearest delivery persons
  app.post("/top-nearest-persons", async (req: Request, res: Response) => {
    try {
      const addresses = req.body;
      if (!addresses)
        return res
          .status(400)
          .json({ msg: "vendor addresses are not defined" });
      //converting addresses into coords
      const convertedAddresses = await convertAddressesToCoords(addresses);

      if (!convertedAddresses)
        return res.status(500).json({
          msg: "Error while convertion process:" + convertedAddresses,
        });

      //this function defines first central part of participiented vendors and based that coords it sorted delivery persons
      const result = await defineBestDeliveryman(convertedAddresses);

      if (!result)
        return res.status(500).json({
          msg: "Error while defining the nearest person:" + result,
        });
      //return top three delivery persos to the client
      return res.status(201).json(result.slice(0, 3));
    } catch (error) {
      return res.status(500).json(error);
    }
  });
  //converted addresses into coords
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
