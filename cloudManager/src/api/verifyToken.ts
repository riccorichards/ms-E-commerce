import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import log from "../utils/logger";
import dotenv from "dotenv";
import Utils from "../utils/utils";
dotenv.config();

//upload process needs all user => (customers, vendors and deliverymen)
interface GlobalUserType {
  user: string;
  vendor: string;
  deliverymanId: string;
}

//extract and decode the public key (RSA), which is store in .env. it is stored in .env base64 format and if it is not existing we are returning "", and if existing we encoded it into Buffer object, and finally, converts this Buffer to an ASCII string representation. ASCII key is using for cryptographic operations.
const publicKey = Buffer.from(
  process.env["RSA_PUBLIC_KEY"] || "",
  "base64"
).toString("ascii");

const vendorPublicKey = Buffer.from(
  process.env["VENDOR_RSA_PUBLIC_KEY"] || "",
  "base64"
).toString("ascii");

const deliverymanPublicKey = Buffer.from(
  process.env["DELIVERYMAN_PUBLIC_KEY"] || "",
  "base64"
).toString("ascii");

//defined the global namespace and assign it to user
declare global {
  namespace Express {
    export interface Request {
      user?: GlobalUserType;
    }
  }
}

interface DecodedType {
  type: string;
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    //as i mentioned we need to handle all users
    const accessToken =
      get(req, "cookies.accessToken") ||
      get(req, "cookies.vendor-accessToken") ||
      get(req, "cookies.delivery-accessToken");

    if (!accessToken) return res.status(401).json({ msg: "No token provided" });
    //decoding processing
    const decodedToken = Utils.decodeIncomingToken(accessToken) as DecodedType;

    if (!decodedToken) return res.status(403).json({ msg: "Invalid token" });

    const userType = decodedToken.type;

    //define incoming user in the system
    let targetKey;
    switch (userType) {
      case "customer":
        targetKey = publicKey;
        break;
      case "vendor":
        targetKey = vendorPublicKey;
        break;
      case "deliveryman":
        targetKey = deliverymanPublicKey;
        break;
      default:
        return res.status(403).json({ msg: "Invalid user type" });
    }
    //verify incoming access token via defined public key
    jwt.verify(accessToken, targetKey, (err: any, user: any) => {
      if (err) return res.status(403).json({ msg: "Invalid token" });
      req.user = user;
      next();
    });
  } catch (error: any) {
    log.error({ err: error.message });
    return res
      .status(500)
      .json({ msg: "Internal server error", err: error.message });
  }
};
