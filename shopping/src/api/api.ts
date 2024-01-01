import { Application, Request, Response } from "express";
import log from "../utils/logger";
import {
  AddressInputValidation,
  OrderInputValidation,
  OrderItemInputValidation,
  PaymentInputValidation,
  ShippingInputValidation,
  TransactionInputValidation,
} from "../database/validation/shopping.validation";
import { validate } from "class-validator";
import ShoppingService from "../services/shopping.service";
import ShoppingRepo from "../database/repository/shopping.repository";
import initialiazeRepo from "../database/repository/initialiaze.repo";
import { verifyJWT } from "./verifyToken";

const api = (app: Application) => {
  const shoppingRepo = new ShoppingRepo(
    initialiazeRepo.orderRepository,
    initialiazeRepo.orderIteRepository,
    initialiazeRepo.shippingRepository,
    initialiazeRepo.addressRepository,
    initialiazeRepo.transactionRepository,
    initialiazeRepo.paymentRepository
  );

  const service = new ShoppingService(shoppingRepo);

  app.use(verifyJWT);

  app.post(
    "/order",
    async (req: Request<{}, {}, OrderInputValidation>, res: Response) => {
      try {
        const errors = (await validate(req.body)) as any;
        if (errors.length > 0) {
          const message = errors
            .map((error: any) => Object.values(error.constraints))
            .join(", ");
          throw new Error(message);
        }

        const newOrder = await service.CreateOrderService(req.body);
        if (!newOrder)
          return res
            .status(404)
            .json({ msg: "Error while creating a new order" });
        return res.status(201).json(newOrder);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  );

  app.post(
    "/order-item/:id",
    async (
      req: Request<{ id: string }, {}, OrderItemInputValidation[]>,
      res: Response
    ) => {
      const id = parseInt(req.params.id);
      try {
        let validationError = [];
        for (const itemInput of req.body) {
          const errors = await validate(itemInput);
          if (errors.length > 0) {
            validationError.push(...errors);
          }
        }

        if (validationError.length > 0) {
          log.error(validationError);
          throw new Error("Validation failed");
        }

        const orderWithItems = await service.CreateOrderItemService(
          id,
          req.body
        );
        if (!orderWithItems)
          return res
            .status(404)
            .json({ msg: "Error while adding an items is the order" });
        return res.status(201).json(orderWithItems);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  );

  app.post(
    "/shipping",
    async (req: Request<{}, {}, ShippingInputValidation>, res: Response) => {
      try {
        const errors = (await validate(req.body)) as any;
        if (errors.length > 0) {
          const message = errors
            .map((error: any) => Object.values(error.constraints))
            .join(", ");
          throw new Error(message);
        }
        const newShipping = await service.CreateShippingService(req.body);

        if (!newShipping)
          return res
            .status(404)
            .json({ msg: "Error while creating a new shipping" });
        return res.status(201).json(newShipping);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  );

  app.post(
    "/shipping/:id",
    async (
      req: Request<{ id: string }, {}, AddressInputValidation>,
      res: Response
    ) => {
      try {
        const id = parseInt(req.params.id);
        const errors = (await validate(req.body)) as any;
        if (errors.length > 0) {
          const message = errors
            .map((error: any) => Object.values(error.constraints))
            .join(", ");
          throw new Error(message);
        }

        const shippingWithAddress = await service.CreateAddressService(
          id,
          req.body
        );
        if (!shippingWithAddress)
          return res
            .status(404)
            .json({ msg: "Error while adding an address into shipping" });
        return res.status(201).json(shippingWithAddress);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  );

  app.post(
    "/transaction/:id",
    async (
      req: Request<{ id: string }, {}, TransactionInputValidation>,
      res: Response
    ) => {
      try {
        const orderId = parseInt(req.params.id);
        const errors = (await validate(req.body)) as any;
        if (errors.length > 0) {
          const message = errors
            .map((error: any) => Object.values(error.constraints))
            .join(", ");
          throw new Error(message);
        }
        const newTransaction = await service.CreateTransactionService(
          orderId,
          req.body
        );
        if (!newTransaction)
          return res
            .status(404)
            .json({ msg: "Error while creating a new transaction" });
        return res.status(201).json(newTransaction);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  );

  app.post(
    "/payment",
    async (req: Request<{}, {}, PaymentInputValidation>, res: Response) => {
      try {
        const errors = (await validate(req.body)) as any;
        if (errors.length > 0) {
          const message = errors
            .map((error: any) => Object.values(error.constraints))
            .join(", ");
          throw new Error(message);
        }
        const newPayment = await service.CreatePayloadService(req.body);
        if (!newPayment)
          return res
            .status(404)
            .json({ msg: "Error whilee creating a new payment" });
        return res.status(201).json(newPayment);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  );

  app.get(
    "/payment",
    async (req: Request<{}, {}, PaymentInputValidation>, res: Response) => {
      try {
        const errors = (await validate(req.body)) as any;
        if (errors.length > 0) {
          const message = errors
            .map((error: any) => Object.values(error.constraints))
            .join(", ");
          throw new Error(message);
        }
        const payments = await service.GetAllPaymentsService();
        if (!payments)
          return res
            .status(404)
            .json({ msg: "Error while creating a new payments" });
        return res.status(200).json(payments);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  );

  app.get(
    "/payment/:id",
    async (req: Request<{ id: string }>, res: Response) => {
      try {
        const id = parseInt(req.params.id);
        const payment = await service.GetPaymentByIdService(id);
        return res.status(200).json(payment);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  );
};

export default api;
