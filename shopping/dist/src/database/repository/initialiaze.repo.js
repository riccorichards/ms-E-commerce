"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectToTypeOrm_1 = require("../connectToTypeOrm");
const address_entity_1 = __importDefault(require("../entities/address.entity"));
const order_entity_1 = __importDefault(require("../entities/order.entity"));
const orderItem_entity_1 = __importDefault(require("../entities/orderItem.entity"));
const payment_entity_1 = __importDefault(require("../entities/payment.entity"));
const shipping_entity_1 = __importDefault(require("../entities/shipping.entity"));
const transaction_entity_1 = __importDefault(require("../entities/transaction.entity"));
const orderRepository = connectToTypeOrm_1.appDataSource.getRepository(order_entity_1.default);
const orderIteRepository = connectToTypeOrm_1.appDataSource.getRepository(orderItem_entity_1.default);
const shippingRepository = connectToTypeOrm_1.appDataSource.getRepository(shipping_entity_1.default);
const addressRepository = connectToTypeOrm_1.appDataSource.getRepository(address_entity_1.default);
const transactionRepository = connectToTypeOrm_1.appDataSource.getRepository(transaction_entity_1.default);
const paymentRepository = connectToTypeOrm_1.appDataSource.getRepository(payment_entity_1.default);
exports.default = {
    orderIteRepository,
    orderRepository,
    shippingRepository,
    addressRepository,
    transactionRepository,
    paymentRepository,
};
