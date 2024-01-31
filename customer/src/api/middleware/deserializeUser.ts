import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJWT } from "../../utils/jwt.utils";
import { generateNewAccessToken } from "../../utils/token.utils";

//deserializeuser functon helps us to handle the incoming user, check its token
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //we are waiting the access token form the cookies and perhabs from the header
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
  // the same as access token
  const refreshToken =
    get(req, "cookies.refreshToken") ||
    (get(req, "headers.x-refresh") as string);

  if (!accessToken) return next();

  //extraction information from the token and its expiration time
  const { decoded, expired } = verifyJWT(accessToken);

  //if information is existing
  if (decoded) {
    //assing the information to the res.locals.user and then return next() to going for protected resources
    res.locals.user = decoded;
    return next();
  }

  //if expiration time is ended, but refresh token is existing
  if (refreshToken && expired) {
    try {
      // we are genereting a new access token and sent it to the cookies
      const { token, error } = await generateNewAccessToken(refreshToken);

      if (error) {
        return res.status(401).json({ error: error });
      }

      if (token) {
        res.cookie("accessToken", token, {
          httpOnly: false,
          path: "/",
          secure: false,
          sameSite: "strict",
          domain: "localhost",
        });

        //then we need to decoded the information from the creating token for ensure that the current user has a permission to take our protected resources
        const result = verifyJWT(token);
        res.locals.user = result.decoded;
        next();
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
};
