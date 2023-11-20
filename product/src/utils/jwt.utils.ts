import config from "config";
import jwt from "jsonwebtoken";
import log from "./logger";

const privateKey = Buffer.from(
  config.get<string>("rsaPriviteKey"),
  "base64"
).toString("ascii");

const publicKey = Buffer.from(
  config.get<string>("rsaPublicKey"),
  "base64"
).toString("ascii");

export const signWihtJWT = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    log.error(error.message);
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};
