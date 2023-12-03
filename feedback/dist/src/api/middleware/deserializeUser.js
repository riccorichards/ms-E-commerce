"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = void 0;
const lodash_1 = require("lodash");
const jwt_utils_1 = require("../../utils/jwt.utils");
const session_controller_1 = require("../database/controllers/session.controller");
const deserializeUser = async (req, res, next) => {
    const accessToken = (0, lodash_1.get)(req, "cookies.accessToken") ||
        (0, lodash_1.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    const refreshToken = (0, lodash_1.get)(req, "cookies.refreshToken") ||
        (0, lodash_1.get)(req, "headers.x-refresh");
    if (!accessToken)
        return next();
    const { decoded, expired } = (0, jwt_utils_1.verifyJWT)(accessToken);
    if (decoded) {
        res.locals.user = decoded;
        return next();
    }
    if (refreshToken && expired) {
        const newAccessToken = await (0, session_controller_1.createNewAccessToken)(refreshToken);
        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                path: "/",
                secure: false,
                sameSite: "strict",
                domain: "localhost",
            });
            const result = (0, jwt_utils_1.verifyJWT)(newAccessToken);
            res.locals.user = result.decoded;
            next();
        }
    }
    return next();
};
exports.deserializeUser = deserializeUser;
