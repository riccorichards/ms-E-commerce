import { Application, Response, Request } from "express";
import CustomerService from "../services/customer.services";
import log from "../utils/logger";
import { signWihtJWT } from "../utils/jwt.utils";
import config from "../../config/default";
import { omit } from "lodash";
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
import ApiErrorHandler from "./apiErrorHandler";

const api = (app: Application, channel: Channel) => {
  const service = new CustomerService();

  SubscribeMessage(channel, config.customer_queue, config.product_binding_key);

  //create user => register
  app.post(
    "/register",
    validateIncomingData(CreateUserSchema), // validation process, first then we start processing with incoming data we need check it
    async (req: Request, res: Response) => {
      try {
        const newCustomer = await service.SignUp(req.body);
        if (!newCustomer)
          return res.status(404).json({ err: "Error with Sign Up" });
        return res.status(201).json(newCustomer._id);
      } catch (error) {
        //if there is any kind of error we have custome error function for handle this
        ApiErrorHandler(error, res);
      }
    }
  );

  //create session for user
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
          { expiresIn: 1800 } // 30 min
        );

        //create a refresh token
        const refreshToken = signWihtJWT(
          {
            user: result.user._id,
            type: "customer",
            session: result.newSession._id,
          },
          { expiresIn: 1296000 } //15 days
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
          ttl: 1800, // we are sending TTl to the client for automatically generation a new access token
        });
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //adding the address
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
        ApiErrorHandler(error, res);
      }
    }
  );

  //adding the bank acc
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
        ApiErrorHandler(error, res);
      }
    }
  );

  //returns information for order
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
        ApiErrorHandler(error, res);
      }
    }
  );

  // return customers length for admin information
  app.get("/customers-length", async (req: Request, res: Response) => {
    try {
      const result = await service.GetCustomersLengthService();
      if (!result)
        return res
          .status(400)
          .json({ msg: "Error while fetching length of all customers" });
      return res.status(200).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  // after this line each endpoint required customer's token
  app.use([deserializeUser, requestUser]);

  // this update function handle the updating process and send the updated data via RabbitMQ to the another servers for update customer info inside orders and feedbacks
  app.put("/update-user", async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.user;
      const updatedUser = await service.UpdateUserProfile(userId, req.body);
      if (!updatedUser)
        return res.status(404).json({ err: "Error with updating process" });
      //creating the event
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

      //define all bindings where the customer data should sent
      const binding_keys_wrapper: BindingKeysType = {
        feedback: config.feedback_binding_key,
        vendor: config.vendor_binding_key,
        deliveryman: config.deliveryman_binding_key,
      };

      if (channel) {
        //we need to loop on the binding keys to send the customer data to the both path
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
      ApiErrorHandler(error, res);
    }
  });

  //updating the address
  app.put("/update-address", async (req: Request, res: Response) => {
    try {
      //take user id from access token
      const userId = res.locals.user.user;
      const updatedAddress = await service.UpdateUserAddress(userId, req.body);
      if (!updatedAddress)
        return res.status(404).json({ err: "Error with updating process" });
      return res.status(201).json(updatedAddress);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });

  //updating the address
  app.put("/update-bank", async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.user;
      const updatedBank = await service.UpdateUserBankInfo(userId, req.body);

      if (!updatedBank)
        return res.status(404).json({ err: "Error with updating process" });
      return res.status(201).json(updatedBank);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });

  //this fucntion helps us when the customer needs to update its password, so first the define the current password to ensure the corretness and then allow the customer to send a new password, after receiving the new password we hashing it and storing to the db
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
      ApiErrorHandler(error, res);
    }
  });

  //to find customer itself
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
      ApiErrorHandler(error, res);
    }
  });
  // returns customers feedbacks
  app.get("/customer-feeds", async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.user;
      //this endpoint handles the pagination logic, so we need to define the page from the query
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
      ApiErrorHandler(error, res);
    }
  });

  //customers log out
  app.delete("/log_out", async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(201).json(null);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });
  //generate a new access token
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
      ApiErrorHandler(error, res);
    }
  });
};

export default api;
