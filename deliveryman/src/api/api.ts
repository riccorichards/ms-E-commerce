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
import { generateNewAccessToken } from "../utils/token.utils";

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
            { expiresIn: 1800 }
          );
          const refreshToken = signWihtJWT(
            {
              deliverymanId: deliveryman.id,
              type: "deliveryman",
              sessionId: newSession.id,
            },
            { expiresIn: 2592000 }
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

          return res.status(200).json({
            deliveryman: omit(deliveryman.toJSON(), "password"),
            ttl: 1800,
          });
        }
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  app.get("/all-deliveryman", async (req: Request, res: Response) => {
    try {
      const page =
        typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;

      const result = await service.GetAlDeliverymanService(page);
      if (result === null)
        return res.status(404).json({
          err: "Error while fetching all valid delivery persons",
        });

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

  app.get("/deliveryman/:name", async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      const isCoords = req.query.isCoords === "true";
      const result = await service.GetDeliverymanByIdService(name, isCoords);
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while fetching delivery person" });
      return res.status(200).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  app.get("/deliveryman-for-order/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await service.GetDelirymanForOrderService(id);
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while fetching delivery person" });
      return res.status(200).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  app.use([deserializeUser, requestUser]);

  app.get("/deliveryman", async (req: Request, res: Response) => {
    try {
      const id = res.locals.delivery.deliverymanId;
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

  app.get("/deliveryman-feedbacks", async (req: Request, res: Response) => {
    try {
      const id = res.locals.delivery.deliverymanId;
      let amountNumber: undefined | number | string = undefined;

      if (typeof req.query.amount === "string") {
        if (req.query.amount === "All") {
          amountNumber = req.query.amount;
        } else {
          const parsedAmount = parseInt(req.query.amount);
          if (isNaN(parsedAmount)) {
            amountNumber = undefined;
          } else {
            amountNumber = parseInt(req.query.amount);
          }
        }
      }
      const result = await service.GetDeliveryFeedsService(id, amountNumber);
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while fetching delivery person" });

      return res.status(200).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  app.get("/delivery-activities", async (req: Request, res: Response) => {
    try {
      const id = res.locals.delivery.deliverymanId;

      const isStats = req.query.isStats === "true";

      let amountNumber: undefined | number | string = undefined;

      if (typeof req.query.amount === "string") {
        if (req.query.amount === "All") {
          amountNumber = req.query.amount;
        } else {
          const parsedAmount = parseInt(req.query.amount);
          if (isNaN(parsedAmount)) {
            amountNumber = undefined;
          } else {
            amountNumber = parseInt(req.query.amount);
          }
        }
      }

      const result = await service.GetDeliveryActivitiesService(
        id,
        isStats,
        amountNumber
      );
      if (!result)
        return res
          .status(404)
          .json({ err: "Error while fetching delivery person" });

      return res.status(200).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  app.put(
    "/update-delivery",
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

  app.post("/refresh-token", async (req: Request, res: Response) => {
    try {
      const refresh = req.cookies["delivery-refreshToken"];

      if (!refresh)
        return res.status(400).json({ msg: "Invalid Refresh Token" });

      const { token, error } = await generateNewAccessToken(refresh);

      if (error) return res.status(400).json({ error: error });

      res.cookie("delivery-accessToken", token, {
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });

      return res.status(200).json({ ttl: 1800 });
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  app.delete("/log_out", async (req: Request, res: Response) => {
    try {
      res.clearCookie("delivery-refreshToken");
      res.clearCookie("delivery-accessToken");
      return res.status(201).json(null);
    } catch (error) {
      return res.status(500).json({ err: error });
    }
  });
};

export default api;
