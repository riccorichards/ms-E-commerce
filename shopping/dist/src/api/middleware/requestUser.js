"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestUser = void 0;
const requestUser = (req, res, next) => {
    const user = res.locals.user;
    if (!user)
        return res.status(403).json({ msg: "Could not found the user..." });
    next();
};
exports.requestUser = requestUser;
