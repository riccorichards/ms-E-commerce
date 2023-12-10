import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJWT } from "../../utils/jwt.utils";
import { generateNewAccessToken } from "../../utils/token.utils";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    get(req, "cookies.refreshToken") ||
    (get(req, "headers.x-refresh") as string);

  if (!accessToken) return next();

  const { decoded, expired } = verifyJWT(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (refreshToken && expired) {
    try {
      const newAccessToken = await generateNewAccessToken(refreshToken);

      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken);

        res.cookie("accessToken", newAccessToken, {
          httpOnly: false,
          path: "/",
          secure: false,
          sameSite: "strict",
          domain: "localhost",
        });

        const result = verifyJWT(newAccessToken);
        res.locals.user = result.decoded;
        next();
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
};
