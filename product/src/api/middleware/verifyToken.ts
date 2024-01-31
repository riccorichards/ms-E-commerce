import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import log from "../../utils/logger";
import { get } from "lodash";

//we are defining here permission only vendors for create a new food
interface GlobalUserType {
  vendor?: string;
}

const publicKey = Buffer.from(
  process.env["RSA_PUBLIC_KEY"] || "",
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
      get(req, "cookies.vendor-accessToken") ||
      get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    if (!accessToken) return res.status(401).json({ msg: "No token provided" });

    jwt.verify(accessToken, publicKey, (err: any, user: any) => {
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
