"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const address_entity_1 = __importDefault(require("./address.entity"));
let Shipping = class Shipping {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Shipping.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 200),
    __metadata("design:type", String)
], Shipping.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 200),
    __metadata("design:type", String)
], Shipping.prototype, "company_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], Shipping.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], Shipping.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 250),
    __metadata("design:type", String)
], Shipping.prototype, "mark", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => address_entity_1.default, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", address_entity_1.default)
], Shipping.prototype, "address", void 0);
Shipping = __decorate([
    (0, typeorm_1.Entity)("shipping")
], Shipping);
exports.default = Shipping;
