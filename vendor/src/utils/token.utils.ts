import { get } from "lodash";
import { signWihtJWT, verifyJWT } from "./jwt.utils";
import SessionModel from "../database/models/session.model";
import UserModel from "../database/models/vendor.model";
import config from "../../config/default";

export const generateNewAccessToken = async (refreshToken: string) => {
  const { decoded } = verifyJWT(refreshToken);

  if (!decoded || !get(decoded, "session")) {
    throw new Error("Something went wrong");
  }

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;
  const profile = await UserModel.findOne({ _id: session.vendor }).lean();

  if (!profile) return false;

  const accessToken = signWihtJWT(
    { vendor: session.vendor, session: session._id },
    { expiresIn: config.accessTokenTtl }
  );

  return accessToken;
};
