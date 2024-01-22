import { get } from "lodash";
import { signWihtJWT, verifyJWT } from "./jwt.utils";
import initialize from "../database/initialize";

export const generateNewAccessToken = async (refreshToken: string) => {
  const { decoded, valid, expired } = verifyJWT(refreshToken);

  if (!valid) {
    if (expired) {
      return { token: null, error: "Expired refresh token" };
    }
    throw new Error("Invalid refresh token");
  }

  if (!decoded || !get(decoded, "sessionId")) {
    throw new Error("Something went wrong");
  }

  const session = await initialize.Session.findByPk(get(decoded, "sessionId"));

  if (!session || !session.isValid) {
    throw new Error("Invalid session");
  }

  const profile = await initialize.Delivery.findByPk(session.delivery);

  if (!profile) {
    throw new Error("User not found");
  }

  const accessToken = signWihtJWT(
    {
      deliverymanId: session.delivery,
      type: "deliveryman",
      sessionId: session.id,
    },
    { expiresIn: 1800 }
  );

  return { token: accessToken, error: undefined };
};
