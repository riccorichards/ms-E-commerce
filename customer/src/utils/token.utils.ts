import { get } from "lodash";
import { signWihtJWT, verifyJWT } from "./jwt.utils";
import SessionModel from "../database/models/session.model";
import UserModel from "../database/models/user.model";

export const generateNewAccessToken = async (refreshToken: string) => {
  const { decoded, valid, expired } = verifyJWT(refreshToken);

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

  const profile = await UserModel.findOne({ _id: session.user }).lean();

  if (!profile) {
    throw new Error("User not found");
  }

  const accessToken = signWihtJWT(
    { user: session.user, type: "customer", session: session._id },
    { expiresIn: 30 }
  );

  return { token: accessToken, error: undefined };
};
