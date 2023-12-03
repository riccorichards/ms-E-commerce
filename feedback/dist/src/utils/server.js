"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("../api/api"));
const config_1 = __importDefault(require("../../config"));
const connectToTypeOrm_1 = require("../database/connectToTypeOrm");
const logger_1 = __importDefault(require("./logger"));
const createServer = () => {
    const app = (0, express_1.default)();
    dotenv_1.default.config();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: config_1.default.origin,
    }));
    connectToTypeOrm_1.appDataSource
        .initialize()
        .then(() => logger_1.default.info({ msg: "Data Source has been initialized!" }))
        .catch((err) => logger_1.default.error({ msg: "Error during Data Source initialization", err: err }));
    (0, api_1.default)(app);
    return app;
};
exports.default = createServer;
