"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logger"));
class ShoppingRepo {
    constructor(orderRepository, orderItemRepository, shippingRepository, addressRepository, transactionRepository, paymentRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.shippingRepository = shippingRepository;
        this.addressRepository = addressRepository;
        this.transactionRepository = transactionRepository;
        this.paymentRepository = paymentRepository;
    }
    //creation operations
    async CreateOrderRepo(orderInput) {
        try {
            const newOrder = this.orderRepository.create(orderInput);
            await this.orderRepository.save(newOrder);
            return newOrder;
        }
        catch (error) {
            logger_1.default.error({ err: error.message });
        }
    }
    async CreateOrderItemRepo(orderId, orderItem) {
        try {
            const order = await this.orderRepository.findOneBy({ id: orderId });
            if (!order) {
                throw new Error("Order not found");
            }
            for (const item of orderItem) {
                const orderItem = this.orderItemRepository.create(Object.assign(Object.assign({}, item), { order: order }));
                await this.orderItemRepository.save(orderItem);
                order.orderItem.push(orderItem);
            }
            await this.orderRepository.save(order);
            return order;
        }
        catch (error) {
            logger_1.default.error({ err: error.message });
        }
    }
    async CreateShippingRepo(shippingInput) {
        try {
            const newShipping = this.shippingRepository.create(shippingInput);
            await this.shippingRepository.save(newShipping);
            return newShipping;
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async CreateAddressRepo(shippingId, addressInput) {
        try {
            const shipping = await this.shippingRepository.findOneBy({
                id: shippingId,
            });
            if (!shipping) {
                throw new Error("Shipping not Found");
            }
            const newAddress = this.addressRepository.create(Object.assign(Object.assign({}, addressInput), { shipping: shipping }));
            await this.addressRepository.save(newAddress);
            shipping.address = newAddress;
            await this.shippingRepository.save(shipping);
            return shipping;
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async CreateTransactionRepo(transactionInput) {
        try {
            const newTnx = this.transactionRepository.create(transactionInput);
            await this.transactionRepository.save(newTnx);
            return newTnx;
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async CreatePaymentRepo(paymentInput) {
        try {
            const order = await this.orderItemRepository.findOneBy({
                id: paymentInput.orderId,
            });
            const transaction = await this.transactionRepository.findOneBy({
                id: paymentInput.transactionId,
            });
            if (!order || !transaction) {
                throw new Error("Error while creating a new payment");
            }
            const newPayment = this.paymentRepository.create(Object.assign({ order: order, transaction: transaction }, paymentInput));
            await this.paymentRepository.save(newPayment);
            return newPayment;
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    //get operations
    async ReturnAllPayments() {
        try {
            return await this.paymentRepository.find({
                relations: ["order", "transaciton"],
            });
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
    async ReturnPaymentById(id) {
        try {
            return await this.paymentRepository.findOne({
                where: { id },
                relations: ["order", "transaction"],
            });
        }
        catch (error) {
            logger_1.default.error(error.message);
        }
    }
}
exports.default = ShoppingRepo;
