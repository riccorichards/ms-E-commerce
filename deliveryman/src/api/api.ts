import { Application, Request, Response } from "express";
import DeliveryService from "../services/delivery.services";
import { deserializeUser } from "./middleware/deserializeUser";
import { requestUser } from "./middleware/requestUser";
import { IncomingLoginData } from "./middleware/validation/login.validation";
import { OrderMenuValidation } from "./middleware/validation/orderMenu.validation";
import { signWihtJWT } from "../utils/jwt.utils";
import config from "../../config";
import { Channel } from "amqplib";
import { SubscribeMessage } from "../utils/rabbitMQ.utils";
import { ApiErrorHandler } from "./ApiErrorHandler";
import {
  IncomingDeliveryData,
  UpdateDeliveryData,
} from "./middleware/validation/deliveryman.validation";
import { IncomingValidationData } from "./middleware/IncomingValidationData";
import { omit } from "lodash";
import { IncomingOrderData } from "./middleware/validation/orders.validation";

const api = (app: Application, channel: Channel) => {
  const service = new DeliveryService();

  SubscribeMessage(
    channel,
    config.deliveryman_queue,
    config.deliveryman_binding_key
  );

  app.post(
    "/signup",
    IncomingValidationData(IncomingDeliveryData),
    async (req: Request, res: Response) => {
      try {
        const newDeliveryman = await service.CreateDeliveryService(req.body);
        if (!newDeliveryman)
          return res.status(404).json({ err: "Error while sign up" });
        return res.status(200).json(newDeliveryman);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  app.post(
    "/login",
    IncomingValidationData(IncomingLoginData),
    async (req: Request, res: Response) => {
      try {
        const userAgent = req.get("user-agent") || "";
        const result = await service.CreateSessionService(req.body, userAgent);
        if (!result) {
          return res.status(404).json({ err: "Error while sign up" });
        } else {
          const { deliveryman, newSession } = result;
          const accessToken = signWihtJWT(
            {
              deliverymanId: deliveryman.id,
              type: "deliveryman",
              sessionId: newSession.id,
            },
            { expiresIn: config.accessTokenTtl }
          );
          const refreshToken = signWihtJWT(
            {
              deliverymanId: deliveryman.id,
              type: "deliveryman",
              sessionId: newSession.id,
            },
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
          console.log(accessToken);
          return res.status(200).json(omit(deliveryman.toJSON(), "password"));
        }
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  app.get("/deliveryman/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await service.GetDeliverymanService(id);
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while fetching delivery person" });
      return res.status(200).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  app.get("/valid-deliveryman", async (req: Request, res: Response) => {
    try {
      const result = await service.GetAllValidDeliverymanService();
      if (result === null)
        return res.status(404).json({
          err: "Error while fetching all valid delivery persons",
        });

      return res.status(200).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  app.get(
    "/deliveryman",
    [deserializeUser, requestUser],
    async (req: Request, res: Response) => {
      try {
        const id = res.locals.delivery.deliverymanId;
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
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  app.post(
    "/delivery-order",
    IncomingValidationData(IncomingOrderData),
    async (req: Request, res: Response) => {
      try {
        const result = await service.CreateOrderService(req.body);
        if (result === null)
          return res.status(404).json({ err: "Error while storing the order" });
        return res.status(201).json(result);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  app.put(
    "/update-delivery",
    [deserializeUser, requestUser],
    IncomingValidationData(UpdateDeliveryData),
    async (req: Request, res: Response) => {
      try {
        const id = res.locals.delivery;
        const result = await service.UpdateDeliverymanService(id, req.body);
        if (!result)
          return res
            .status(404)
            .json({ err: "Error while updating delivery info" });
        return res.status(201).json(result);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  app.post("/order-menu", async (req: Request, res: Response) => {
    try {
      OrderMenuValidation.parse(req.body);
      const result = await service.AddOrderMenuService(req.body);
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while adding a new order menu" });
      return res.status(201).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });
};

export default api;
