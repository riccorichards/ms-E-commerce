import { Application, Response, Request } from "express";
import CustomerService from "../services/customer.services";
import log from "../utils/logger";
import { signWihtJWT } from "../utils/jwt.utils";
import config from "../../config/default";
import { get, omit } from "lodash";
import { deserializeUser } from "./middleware/deserializeUser";
import { requestUser } from "./middleware/requestUser";
import { Channel } from "amqplib";
import { SubscribeMessage } from "../utils/rabbitMQ.utils";
import { CreateUserSchema } from "./middleware/validation/user.validation";
import { validateIncomingData } from "./middleware/validateResources";
import { CreateSessionSchema } from "./middleware/validation/session.validation";
import { CreateAddressSchema } from "./middleware/validation/address.validation";
import { CreateBankAccSchema } from "./middleware/validation/bankAcc.validation";
import { generateNewAccessToken } from "../utils/token.utils";
import SessionModel from "../database/models/session.model";

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
        const session = await service.SessionService(
          req.body,
          req.get("user-agent") || ""
        );

        if (!session) return res.status(404).json({ err: "Wrong credentials" });

        //create an access token
        const accessToken = signWihtJWT(
          { user: session.user, session: session._id },
          { expiresIn: 3600 }
        );

        //create a refresh token
        const refreshToken = signWihtJWT(
          { user: session.user, session: session._id },
          { expiresIn: 86400 }
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

        return res.status(201).json({ refreshToken, accessToken });
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

  app.use([deserializeUser, requestUser]);

  app.post("/generate-new-token", (req: Request, res: Response) => {
    try {
      const refreshToken =
        get(req, "cookies.refreshToken") ||
        (get(req, "headers.x-refresh") as string);

      const newAccessToken = generateNewAccessToken(refreshToken);

      if (!newAccessToken)
        return res
          .status(400)
          .json("Something went wrong while creating a new token");

      return res
        .status(200)
        .json({ msg: "New access token was successfully created" });
    } catch (error) {
      return res.status(500).json(error);
    }
  });

  app.put("/update-user/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const updatedUser = await service.UpdateUserProfile(userId, req.body);
      if (!updatedUser)
        return res.status(404).json({ err: "Error with updating process" });
      return res.status(201).json(omit(updatedUser.toJSON(), "password"));
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.put("/update-address/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const updatedAddress = await service.UpdateUserAddress(userId, req.body);
      if (!updatedAddress)
        return res.status(404).json({ err: "Error with updating process" });
      return res.status(201).json(updatedAddress);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.put("/update-bank/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const updatedBank = await service.UpdateUserBankInfo(userId, req.body);

      if (!updatedBank)
        return res.status(404).json({ err: "Error with updating process" });
      return res.status(201).json(updatedBank);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.get("/find-user/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await service.FindCustomer(userId);
      if (!user)
        return res.status(404).json({ err: "Error with fetching user" });

      return res.status(201).json(user);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.get("/user-spec-data/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const field = Array.isArray(req.query.field)
        ? (req.query.field[0] as string)
        : (req.query.field as string);

      if (!field) return res.status(400).json({ msg: "Bad request" });

      const user = await service.CustomerData(userId, field);

      if (!user) return res.status(404).json({ err: "User not found" });
      return res.status(200).json(user);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.delete("/log_out", async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.sendStatus(204);
    } catch (error: any) {
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  });

  app.post("/refresh", async (req: Request, res: Response) => {
    try {
      const refreshToken =
        get(req, "cookies.refreshToken") ||
        (get(req, "headers.x-refresh") as string);

      if (!refreshToken) return res.status(403).json("Not Provided Token");

      const token = res.locals.user;
      const session = await SessionModel.findById(token.session);

      const newAccessToken = signWihtJWT(
        { user: token.user, session: session?._id },
        { expiresIn: 3600 }
      );

      console.log({ newAccessToken, note: "api" });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: false,
        path: "/",
        secure: false,
        sameSite: "strict",
        domain: "localhost",
      });

      return res.status(201).json(newAccessToken);
    } catch (error) {
      if (error instanceof Error) {
        log.error("Error while creating a new accesstoken =>" + error.message);
        return res.status(400).json(error.message);
      }
    }
  });
};

export default api;
