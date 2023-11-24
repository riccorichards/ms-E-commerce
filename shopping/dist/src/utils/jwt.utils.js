"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.signWihtJWT = void 0;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("./logger"));
const privateKey = Buffer.from(config_1.default.get("rsaPriviteKey"), "base64").toString("ascii");
const publicKey = Buffer.from(config_1.default.get("rsaPublicKey"), "base64").toString("ascii");
const signWihtJWT = (object, options) => {
    return jsonwebtoken_1.default.sign(object, privateKey, Object.assign(Object.assign({}, (options && options)), { algorithm: "RS256" }));
};
exports.signWihtJWT = signWihtJWT;
const verifyJWT = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded,
        };
    }
    catch (error) {
        logger_1.default.error(error.message);
        return {
            valid: false,
            expired: error.message === "jwt expired",
            decoded: null,
        };
    }
};
exports.verifyJWT = verifyJWT;
