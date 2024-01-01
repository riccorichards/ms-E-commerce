import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import log from "../utils/logger";
import dotenv from "dotenv";
dotenv.config();

interface GlobalUserType {
  user: string;
  vendor: string;
}

const publicKey = Buffer.from(
  process.env["RSA_PUBLIC_KEY"] || "",
  "base64"
).toString("ascii");

const vendorPublicKey = Buffer.from(
  process.env["VENDOR_RSA_PUBLIC_KEY"] || "",
  "base64"
).toString("ascii");

declare global {
  namespace Express {
    export interface Request {
      user?: GlobalUserType;
    }
  }
}

const decodeIncomingToken = (token: string) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    if (error instanceof Error) {
      log.error("Error decoding token", error.message);
      return null;
    }
  }
};

interface DecodedType {
  type: string;
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken =
      get(req, "cookies.accessToken") ||
      get(req, "headers.authorization", "").replace(/^Bearer\s/, "") ||
      get(req, "cookies.vendor-accessToken") ||
      get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    if (!accessToken) return res.status(401).json({ msg: "No token provided" });

    const decodedToken = decodeIncomingToken(accessToken) as DecodedType;

    if (!decodedToken) return res.status(403).json({ msg: "Invalid token" });

    const userType = decodedToken.type;
    let targetKey;
    switch (userType) {
      case "customer":
        targetKey = publicKey;
        break;
      case "vendor":
        targetKey = vendorPublicKey;
        break;
      default:
        return res.status(403).json({ msg: "Invalid user type" });
    }

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
