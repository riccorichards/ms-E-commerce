"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIncomingData = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const validateIncomingData = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(400).json(error.errors); // errors is an object from zod where store errors with msg
    }
};
exports.validateIncomingData = validateIncomingData;
