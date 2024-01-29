import { Application, Response, Request } from "express";
import CustomerService from "../services/customer.services";
import log from "../utils/logger";
import { signWihtJWT } from "../utils/jwt.utils";
import config from "../../config/default";
import { get, omit } from "lodash";
import { deserializeUser } from "./middleware/deserializeUser";
import { requestUser } from "./middleware/requestUser";
import { Channel } from "amqplib";
import { PublishMessage, SubscribeMessage } from "../utils/rabbitMQ.utils";
import { CreateUserSchema } from "./middleware/validation/user.validation";
import { validateIncomingData } from "./middleware/validateResources";
import { CreateSessionSchema } from "./middleware/validation/session.validation";
import { CreateAddressSchema } from "./middleware/validation/address.validation";
import { CreateBankAccSchema } from "./middleware/validation/bankAcc.validation";
import { generateNewAccessToken } from "../utils/token.utils";
import { BindingKeysType } from "../database/types/type.event";

const api = (app: Application, channel: Channel) => {
  const service = new CustomerService();

  SubscribeMessage(channel, config.customer_queue, config.product_binding_key);

  app.post(
    "/register",
    validateIncomingData(CreateUserSchema),
    async (req: Request, res: Response) => {
      try {
        const newCustomer = await service.SignUp(req.body);
        if (!newCustomer)
          return res.status(404).json({ err: "Error with Sign Up" });
        return res.status(201).json(newCustomer._id);
      } catch (error) {
        log.error("Server Internal" + error);
        return res.status(500).json({ err: error, msg: "Server Internal" });
      }
    }
  );

  app.post(
    "/login",
    validateIncomingData(CreateSessionSchema),
    async (req: Request, res: Response) => {
      try {
        const result = await service.SessionService(
          req.body,
          req.get("user-agent") || ""
        );

        if (!result) return res.status(404).json({ err: "Wrong credentials" });

        //create an access token
        const accessToken = signWihtJWT(
          {
            user: result.user._id,
            type: "customer",
            session: result.newSession._id,
          },
          { expiresIn: 1800 }
        );

        //create a refresh token
        const refreshToken = signWihtJWT(
          {
            user: result.user._id,
            type: "customer",
            session: result.newSession._id,
          },
          { expiresIn: 2592000 }
        );

        res.cookie("accessToken", accessToken, {
          maxAge: 3.154e10,
          httpOnly: false,
          domain: "localhost",
          path: "/",
          sameSite: "strict",
          secure: false,
        });

        res.cookie("refreshToken", refreshToken, {
          maxAge: 3.154e10,
          httpOnly: true,
          domain: "localhost",
          path: "/",
          sameSite: "strict",
          secure: false,
        });

        return res.status(201).json({
          customer: omit(result.user.toJSON(), "password"),
          ttl: 1800,
        });
      } catch (error) {
        log.error("Server Internal" + error);
        return res.status(500).json({ err: error, msg: "Server Internal" });
      }
    }
  );

  app.post(
    "/address",
    validateIncomingData(CreateAddressSchema),
    async (req: Request, res: Response) => {
      try {
        const address = await service.UserAddress(req.body);
        if (!address)
          return res
            .status(404)
            .json({ err: "Error with adding address information" });
        return res.status(201).json(address._id);
      } catch (error: any) {
        log.error("Server Internal" + error);
        return res.status(500).json({ err: error, msg: "Server Internal" });
      }
    }
  );

  app.post(
    "/bank-acc",
    validateIncomingData(CreateBankAccSchema),
    async (req: Request, res: Response) => {
      try {
        console.log(req.body);
        const result = await service.UserBankAcc(req.body);
        if (!result)
          return res
            .status(404)
            .json({ err: "Error with adding bank Details information" });

        return res.status(201).json(result._id);
      } catch (error: any) {
        log.error("Server Internal" + error);
        return res.status(500).json({ err: error, msg: "Server Internal" });
      }
    }
  );

  app.get(
    "/order-customer-info/:customerId",
    async (req: Request, res: Response) => {
      try {
        const { customerId } = req.params;
        const result = await service.GetCustomerInfoByIdService(customerId);
        if (!result)
          return res
            .status(400)
            .json({ msg: "Customer was not found on that ID" });

        return res.status(200).json(result);
      } catch (error) {
        log.error("Server Internal" + error);
        return res.status(500).json({ err: error, msg: "Server Internal" });
      }
    }
  );

  app.get("/customers-length", async (req: Request, res: Response) => {
    try {
      const result = await service.GetCustomersLengthService();
      if (!result)
        return res
          .status(400)
          .json({ msg: "Customer was not found on that ID" });
      return res.status(200).json(result);
    } catch (error) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.use([deserializeUser, requestUser]);

  app.put("/update-user", async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.user;
      const updatedUser = await service.UpdateUserProfile(userId, req.body);
      if (!updatedUser)
        return res.status(404).json({ err: "Error with updating process" });

      const event = {
        type: "update_customer_info",
        data: {
          userId,
          updatedImage: updatedUser.image,
          updatedUsername: updatedUser.username,
          updatedEmail: updatedUser.email,
          updatedAddress: updatedUser.address,
        },
      };

      const binding_keys_wrapper: BindingKeysType = {
        feedback: config.feedback_binding_key,
        vendor: config.vendor_binding_key,
        deliveryman: config.deliveryman_binding_key,
      };

      if (channel) {
        for (const key in binding_keys_wrapper) {
          PublishMessage(
            channel,
            binding_keys_wrapper[key],
            JSON.stringify(event)
          );
        }

        PublishMessage(
          channel,
          config.shopping_binding_key,
          JSON.stringify(event)
        );
      }

      return res.status(201).json({
        customer: omit(updatedUser.toJSON(), "password"),
        ttl: 1800,
      });
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.put("/update-address", async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.user;
      const updatedAddress = await service.UpdateUserAddress(userId, req.body);
      if (!updatedAddress)
        return res.status(404).json({ err: "Error with updating process" });
      return res.status(201).json(updatedAddress);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.put("/update-bank", async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.user;
      const updatedBank = await service.UpdateUserBankInfo(userId, req.body);

      if (!updatedBank)
        return res.status(404).json({ err: "Error with updating process" });
      return res.status(201).json(updatedBank);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.post("/check-current-password", async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.user;
      const result = await service.CheckCurrentPasswordService(
        userId,
        req.body.currentPassword
      );

      if (!result)
        return res
          .status(404)
          .json({ err: "Error with password checking process" });
      return res.status(201).json(result);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.get("/find-user", async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.user;
      const user = await service.FindCustomer(userId);
      if (!user)
        return res.status(404).json({ err: "Error with fetching user" });

      return res
        .status(201)
        .json({ customer: omit(user.toJSON(), "password"), ttl: 1800 });
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.get("/customer-feeds", async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.user;
      const page =
        typeof req.query.page === "string"
          ? parseInt(req.query.page, 10)
          : undefined;

      if (!page) return res.status(400).json({ msg: "Bad request" });
      const result = await service.CustomerFeedsService(userId, page);

      if (!result)
        return res.status(404).json({ err: "Error while fetching feedbacks" });

      return res.status(200).json(result);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.delete("/log_out", async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(201).json(null);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.post("/refresh-token", async (req: Request, res: Response) => {
    try {
      const refresh = req.cookies["refreshToken"];
      if (!refresh)
        return res.status(400).json({ msg: "Invalid Refresh Token" });

      const { token, error } = await generateNewAccessToken(refresh);

      if (error) return res.status(401).json({ error: error });

      res.cookie("accessToken", token, {
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });

      return res.status(200).json({ ttl: 1800 });
    } catch (error) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });
};

export default api;
