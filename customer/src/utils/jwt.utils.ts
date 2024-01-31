import jwt from "jsonwebtoken";
import config from "config";
import log from "./logger";

//extract and decode the public key (RSA), which is store in .env. it is stored in .env base64 format and if it is not existing we are returning "", and if existing we encoded it into Buffer object, and finally, converts this Buffer to an ASCII string representation. ASCII key is using for cryptographic operations.
const privateKey = Buffer.from(
  config.get<string>("rsaPriviteKey"),
  "base64"
).toString("ascii");

const publicKey = Buffer.from(
  config.get<string>("rsaPublicKey"),
  "base64"
).toString("ascii");

//creating signed fucntion
export const signWihtJWT = (
  object: Object, //waits for information for encoded
  options?: jwt.SignOptions | undefined // some additional information, like expiration time of token
) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256", // it use RS256 alg for hashing the information
  });
};

//verify the token
export const verifyJWT = (token: string) => {
  try {
    //if public key is correct we are decoding the token and take information
    const decoded = jwt.verify(token, publicKey);
    if (!decoded) throw new Error("Invalid Token, (verify jwt)");
    
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    log.error(error.message, "Error in verify jwt");
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};
