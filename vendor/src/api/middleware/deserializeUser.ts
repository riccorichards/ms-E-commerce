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
    get(req, "cookies.vendor-accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    get(req, "cookies.vendor-refreshToken") ||
    (get(req, "headers.x-refresh") as string);

  if (!accessToken) return next();

  const { decoded, expired } = verifyJWT(accessToken);

  if (decoded) {
    res.locals.vendor = decoded;
    return next();
  }

  if (refreshToken && expired) {
    try {
      const { token, error } = await generateNewAccessToken(refreshToken);

      if (error) {
        return res.status(401).json({ error: error });
      }

      if (token) {
        res.setHeader("x-vendor-access-token", token);

        res.cookie("vendor-accessToken", token, {
          httpOnly: false,
          path: "/",
          secure: false,
          sameSite: "strict",
          domain: "localhost",
        });

        const result = verifyJWT(token);
        res.locals.vendor = result.decoded;
        next();
      }
    } catch (error) {
      next(error);
    }
  }
};
