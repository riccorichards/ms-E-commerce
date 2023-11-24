"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const class_validator_1 = require("class-validator");
const shopping_service_1 = __importDefault(require("../services/shopping.service"));
const shopping_repository_1 = __importDefault(require("../database/repository/shopping.repository"));
const initialiaze_repo_1 = __importDefault(require("../database/repository/initialiaze.repo"));
const api = (app) => {
    const shoppingRepo = new shopping_repository_1.default(initialiaze_repo_1.default.orderRepository, initialiaze_repo_1.default.orderIteRepository, initialiaze_repo_1.default.shippingRepository, initialiaze_repo_1.default.addressRepository, initialiaze_repo_1.default.transactionRepository, initialiaze_repo_1.default.paymentRepository);
    const service = new shopping_service_1.default(shoppingRepo);
    app.post("/order", async (req, res) => {
        try {
            const errors = (await (0, class_validator_1.validate)(req.body));
            if (errors.length > 0) {
                const message = errors
                    .map((error) => Object.values(error.constraints))
                    .join(", ");
                throw new Error(message);
            }
            const newOrder = await service.CreateOrderService(req.body);
            return res.status(201).json(newOrder);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    });
    app.post("/order-item/:id", async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            let validationError = [];
            for (const itemInput of req.body) {
                const errors = await (0, class_validator_1.validate)(itemInput);
                if (errors.length > 0) {
                    validationError.push(...errors);
                }
            }
            if (validationError.length > 0) {
                logger_1.default.error(validationError);
                throw new Error("Validation failed");
            }
            const orderWithItems = await service.CreateOrderItemService(id, req.body);
            return res.status(201).json(orderWithItems);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    });
    app.post("/shipping", async (req, res) => {
        try {
            const errors = (await (0, class_validator_1.validate)(req.body));
            if (errors.length > 0) {
                const message = errors
                    .map((error) => Object.values(error.constraints))
                    .join(", ");
                throw new Error(message);
            }
            const newShipping = await service.CreateShippingService(req.body);
            return res.status(201).json(newShipping);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    });
    app.post("/shipping/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const errors = (await (0, class_validator_1.validate)(req.body));
            if (errors.length > 0) {
                const message = errors
                    .map((error) => Object.values(error.constraints))
                    .join(", ");
                throw new Error(message);
            }
            const shippingWithAddress = await service.CreateAddressService(id, req.body);
            return res.status(201).json(shippingWithAddress);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    });
    app.post("/transaction", async (req, res) => {
        try {
            const errors = (await (0, class_validator_1.validate)(req.body));
            if (errors.length > 0) {
                const message = errors
                    .map((error) => Object.values(error.constraints))
                    .join(", ");
                throw new Error(message);
            }
            const newTransaction = await service.CreateTransactionService(req.body);
            return res.status(201).json(newTransaction);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    });
    app.post("/payment", async (req, res) => {
        try {
            const errors = (await (0, class_validator_1.validate)(req.body));
            if (errors.length > 0) {
                const message = errors
                    .map((error) => Object.values(error.constraints))
                    .join(", ");
                throw new Error(message);
            }
            const newPayment = await service.CreatePayloadService(req.body);
            return res.status(201).json(newPayment);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    });
    app.get("/payment", async (req, res) => {
        try {
            const payments = await service.GetAllPaymentsService();
            return res.status(200).json(payments);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    });
    app.get("/payment/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const payment = await service.GetPaymentByIdService(id);
            return res.status(200).json(payment);
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    });
};
exports.default = api;
