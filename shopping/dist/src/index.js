"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
const server_1 = __importDefault(require("./utils/server"));
const config_1 = __importDefault(require("../config"));
require("reflect-metadata");
const port = config_1.default.port;
const app = (0, server_1.default)();
app.listen(port, async () => {
    logger_1.default.info(`We are Running at http//localhost:${port}`);
});
