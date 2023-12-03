"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
class ShoppingService {
    constructor(shoppingRepo) {
        this.shoppingRepo = shoppingRepo;
    }
    async CreateOrderService(orderInput) {
        try {
            return await this.shoppingRepo.CreateOrderRepo(orderInput);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async CreateOrderItemService(orderId, orderItemInput) {
        try {
            return await this.shoppingRepo.CreateOrderItemRepo(orderId, orderItemInput);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async CreateShippingService(shippingInput) {
        try {
            return await this.shoppingRepo.CreateShippingRepo(shippingInput);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async CreateAddressService(shippingId, address) {
        try {
            return await this.shoppingRepo.CreateAddressRepo(shippingId, address);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async CreateTransactionService(transactioInput) {
        try {
            return await this.shoppingRepo.CreateTransactionRepo(transactioInput);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async CreatePayloadService(paymentInput) {
        try {
            return await this.shoppingRepo.CreatePaymentRepo(paymentInput);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async GetAllPaymentsService() {
        try {
            return await this.shoppingRepo.ReturnAllPayments();
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async GetPaymentByIdService(id) {
        try {
            return await this.shoppingRepo.ReturnPaymentById(id);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
}
exports.default = ShoppingService;
