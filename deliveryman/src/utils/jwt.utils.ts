import jwt from "jsonwebtoken";
import log from "./logger";
import dotenv from "dotenv";

dotenv.config();

const privateKey = Buffer.from(
  process.env["RSA_PRIVATE_KEY"] || "",
  "base64"
).toString("ascii");

const publicKey = Buffer.from(
  process.env["RSA_PUBLIC_KEY"] || "",
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

    if (!decoded) throw new Error("Invalid Token, (verify jwt)");

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        valid: false,
        expired: error.message === "jwt expired",
        decoded: null,
      };
    }
    throw new Error("Unknown Error:" + error);
  }
};
