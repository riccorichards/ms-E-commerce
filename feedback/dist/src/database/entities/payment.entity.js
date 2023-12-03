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
const transaction_entity_1 = __importDefault(require("./transaction.entity"));
const order_entity_1 = __importDefault(require("./order.entity"));
let Payment = class Payment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 10),
    __metadata("design:type", String)
], Payment.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => transaction_entity_1.default, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", transaction_entity_1.default)
], Payment.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => order_entity_1.default, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", order_entity_1.default)
], Payment.prototype, "order", void 0);
Payment = __decorate([
    (0, typeorm_1.Entity)("payment")
], Payment);
exports.default = Payment;
