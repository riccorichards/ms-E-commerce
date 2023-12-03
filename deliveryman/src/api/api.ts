import { Application, Request, Response } from "express";
import DeliveryService from "../services/delivery.services";
import log from "../utils/logger";
import { deserializeUser } from "./middleware/deserializeUser";
import { requestUser } from "./middleware/requestUser";
import { ZodError } from "zod";
import {
  IncomingDeliveryData,
  UpdateDeliveryValidation,
} from "./middleware/validation/deliveryman.validation";
import { LoginValidation } from "./middleware/validation/login.validation";
import { OrderValidation } from "./middleware/validation/orders.validation";
import { OrderMenuValidation } from "./middleware/validation/orderMenu.validation";
import { CustomerValidation } from "./middleware/validation/customer.validation";
import { signWihtJWT } from "../utils/jwt.utils";
import config from "../../config";
import { IncomingVendorValidation } from "./middleware/validation/vendor.validation";
import { Channel } from "amqplib";
import { SubscribeMessage } from "../utils/rabbitMQ.utils";

const api = (app: Application, channel: Channel) => {
  const service = new DeliveryService();

  SubscribeMessage(
    channel,
    config.deliveryman_queue,
    config.deliveryman_binding_key
  );

  app.post("/signup", async (req: Request, res: Response) => {
    try {
      IncomingDeliveryData.parse(req.body);
      const newDeliveryman = await service.CreateDeliveryService(req.body);
      if (!newDeliveryman)
        return res.status(404).json({ err: "Error while sign up" });
      return res.status(200).json(newDeliveryman);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json({ error: error.errors });
      }
      log.error(error);
      return res.status(500).json(error.message);
    }
  });

  app.post("/login", async (req: Request, res: Response) => {
    try {
      LoginValidation.parse(req.body);
      const userAgent = req.get("user-agent") || "";
      const result = await service.CreateSessionService(req.body, userAgent);
      if (!result) {
        return res.status(404).json({ err: "Error while sign up" });
      } else {
        const accessToken = signWihtJWT(
          { user: result.delivery, session: result.id },
          { expiresIn: config.accessTokenTtl }
        );
        const refreshToken = signWihtJWT(
          { user: result.delivery, session: result.id },
          { expiresIn: config.refreshTtl }
        );

        res.cookie("delivery-accessToken", accessToken, {
          maxAge: 3.154e10,
          httpOnly: true,
          domain: "localhost",
          path: "/",
          sameSite: "strict",
          secure: false,
        });
        res.cookie("delivery-refreshToken", refreshToken, {
          maxAge: 3.154e10,
          httpOnly: true,
          domain: "localhost",
          path: "/",
          sameSite: "strict",
          secure: false,
        });
        return res.status(200).json({ accessToken, refreshToken });
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }

      log.error(error.message);
      return res.status(500).json(error.message);
    }
  });

  app.get("/deliveryman/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await service.GetDeliverymanService(id);
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while fetching delivery person" });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error(error.message);
      return res.status(500).json(error.message);
    }
  });

  app.get("/deliveryman/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const field = Array.isArray(req.query.field)
        ? (req.query.field[0] as string)
        : (req.query.field as string);

      const result = await service.GetDeliverymanWithSpecFieldService(
        id,
        field
      );

      if (!result)
        return res.status(404).json({
          err: "Error while fetching delivery person with specific field",
        });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error(error.message);
      return res.status(500).json(error.message);
    }
  });

  app.use([deserializeUser, requestUser]);

  app.post("/delivery-order", async (req: Request, res: Response) => {
    try {
      OrderValidation.parse(req.body);
      const result = await service.CreateOrderService(req.body);
      if (result === null)
        return res.status(404).json({ err: "Error while log in" });
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error(error.message);
      return res.status(500).json(error.message);
    }
  });

  app.put("/update-delivery/:id", async (req: Request, res: Response) => {
    try {
      UpdateDeliveryValidation.parse(req.body);
      const id = parseInt(req.params.id);
      const result = await service.UpdateDeliverymanService(id, req.body);
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while updating delivery info" });
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error(error.message);
      return res.status(500).json(error.message);
    }
  });

  app.post("/order-menu", async (req: Request, res: Response) => {
    try {
      OrderMenuValidation.parse(req.body);
      const result = await service.AddOrderMenuService(req.body);
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while adding a new order menu" });
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error(error.message);
      return res.status(500).json(error.message);
    }
  });

  app.post("/customer-into", async (req: Request, res: Response) => {
    try {
      CustomerValidation.parse(req.body);
      const result = await service.AddCustomerInfoService(req.body);
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while adding customer info" });
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error(error.message);
      return res.status(500).json(error.message);
    }
  });

  app.post("/vendor-into", async (req: Request, res: Response) => {
    try {
      IncomingVendorValidation.parse(req.body);
      const result = await service.AddVendorInfoService(req.body);
      if (!result)
        return res.status(404).json({ err: "Error while adding vendor info" });
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error(error.message);
      return res.status(500).json(error.message);
    }
  });
};

export default api;
