import { Request, Response } from "express";
import config from "../../config";
import jwt from "jsonwebtoken";
import log from "./logger";

class Utils {
  static defineUser(address: string, req: Request) {
    let targetUser;
    switch (address) {
      case "customer":
        targetUser = req.user?.user;
        return targetUser;
      case "vendor":
        targetUser = req.user?.vendor;
        return targetUser;
      case "deliveryman":
        targetUser = req.user?.deliverymanId;
        return targetUser;
    }
  }

  static defineFolderName(type: string) {
    return type === "foods"
      ? "foods"
      : type === "profiles"
      ? "profiles"
      : "gallery";
  }

  static defineDiretion(address: string, type: string) {
    const targetType = { targetAddress: "", targetPath: "" };

    switch (address) {
      case "customer":
        targetType.targetAddress = "upload_profile_url";
        targetType.targetPath = config.customer_binding_key;
        return targetType;
      case "vendor":
        switch (type) {
          case "profiles":
            targetType.targetAddress = "upload_vendor_profile";
            targetType.targetPath = config.vendor_binding_key;
            return targetType;
          case "gallery":
            targetType.targetAddress = "upload_vendor_gallery";
            targetType.targetPath = config.vendor_binding_key;
            return targetType;
          case "foods":
            targetType.targetAddress = "upload_vendor_product";
            targetType.targetPath = config.vendor_binding_key;
            return targetType;
        }
        return targetType;
      case "deliveryman":
        targetType.targetAddress = "upload_deliveryman_profile";
        targetType.targetPath = config.deliveryman_binding_key;
        return targetType;
    }
  }

  static decodeIncomingToken(token: string) {
    try {
      return jwt.decode(token);
    } catch (error) {
      if (error instanceof Error) {
        log.error("Error decoding token", error.message);
        return null;
      }
    }
  }
}

export default Utils;
