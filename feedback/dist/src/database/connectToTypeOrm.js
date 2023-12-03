"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
const typeorm_1 = require("typeorm");
const typeorm_json_1 = __importDefault(require("../../typeorm.json"));
const dataSourceOption = Object.assign(Object.assign({}, typeorm_json_1.default), { type: "postgres" });
exports.appDataSource = new typeorm_1.DataSource(dataSourceOption);
