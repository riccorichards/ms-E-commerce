import { get } from "lodash";
import { signWihtJWT, verifyJWT } from "./jwt.utils";
import SessionModel from "../database/models/session.model";
import UserModel from "../database/models/vendor.model";

type GenerateNewTokenType = {
  token: string | null;
  error?: string;
};

export const generateNewAccessToken = async (
  refreshToken: string
): Promise<GenerateNewTokenType> => {
  const { decoded, expired, valid } = verifyJWT(refreshToken);

  if (!valid) {
    if (expired) {
      return { token: null, error: "Expired refresh token" };
    }
    throw new Error("Invalid refresh token");
  }

  if (!decoded || !get(decoded, "session")) {
    throw new Error("Something went wrong");
  }

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) {
    throw new Error("Invalid session");
  }

  const profile = await UserModel.findOne({ _id: session.vendor }).lean();

  if (!profile) {
    throw new Error("User not found");
  }

  const accessToken = signWihtJWT(
    { vendor: session.vendor, type: "vendor", session: session._id },
    { expiresIn: 60 }
  );

  return { token: accessToken, error: undefined };
};
