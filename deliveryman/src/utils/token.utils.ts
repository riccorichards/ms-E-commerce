import { get } from "lodash";
import { signWihtJWT, verifyJWT } from "./jwt.utils";
import config from "../../config/index";
import initialize from "../database/initialize";

export const generateNewAccessToken = async (refreshToken: string) => {
  const { decoded } = verifyJWT(refreshToken);

  if (!decoded || !get(decoded, "session")) {
    throw new Error("Something went wrong");
  }

  const session = await initialize.Session.findByPk(get(decoded, "session"));

  if (!session)
    throw new Error(
      "Error while retrieving the session ================ in generateNewAccessToken"
    );

  const accessToken = signWihtJWT(
    { user: session.delivery, session: session.id },
    { expiresIn: config.accessTokenTtl }
  );

  return accessToken;
};
