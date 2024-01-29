import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import log from "../utils/logger";

interface GlobalUserType {
  user: string;
}

const publicKey = Buffer.from(
  process.env["CUSTOMER_RSA_PUBLIC_KEY"] || "",
  "base64"
).toString("ascii");

declare global {
  namespace Express {
    export interface Request {
      user?: GlobalUserType;
    }
  }
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken =
      get(req, "cookies.accessToken") ||
      get(req, "cookies.delivery-accessToken");

    if (!accessToken) return res.status(401).json({ msg: "No token provided" });

    jwt.verify(accessToken, publicKey, (err: any, user: any) => {
      if (err) return res.status(403).json({ msg: "Invalid token", err: err });
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
