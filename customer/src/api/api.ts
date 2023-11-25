import { Application, Response, Request } from "express";
import CustomerService from "../services/customer.services";
import log from "../utils/logger";
import { signWihtJWT } from "../utils/jwt.utils";
import config from "../../config/default";
import { omit } from "lodash";
import { deserializeUser } from "./middleware/deserializeUser";
import { requestUser } from "./middleware/requestUser";
const api = (app: Application) => {
  const service = new CustomerService();

  app.post("/register", async (req: Request, res: Response) => {
    try {
      const newCustomer = await service.SignUp(req.body);
      if (!newCustomer)
        return res.status(404).json({ err: "Error with Sign Up" });
      return res.status(201).json(omit(newCustomer.toJSON(), "password"));
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });

  app.post("/login", async (req: Request, res: Response) => {
    try {
      const session = await service.SessionService(
        req.body,
        req.get("user-agent") || ""
      );

      if (!session) return res.status(404).json({ err: "Wrong credentials" });

      //create an access token
      const accessToken = signWihtJWT(
        { user: session.user, session: session._id },
        { expiresIn: config.accessTokenTtl }
      );

      //create a refresh token
      const refreshToken = signWihtJWT(
        { user: session.user, session: session._id },
        { expiresIn: config.accessRefreshTtl }
      );
      res.cookie("accessToken", accessToken, {
        maxAge: 3.154e10,
        httpOnly: true,
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
    } catch (error: any) {
      return res.status(400).json({ err: error.message });
    }
  });

  app.use([deserializeUser, requestUser]);
  
  app.post(
    "/address",
    [deserializeUser, requestUser],
    async (req: Request, res: Response) => {
      console.log(res.locals.user, "Address");
      try {
        const address = await service.UserAddress(req.body);
        if (!address)
          return res
            .status(404)
            .json({ err: "Error with adding address information" });

        return res.status(201).json(address);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );

  app.put("/update-user/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const updatedUser = await service.UpdateUserProfile(userId, req.body);
      if (!updatedUser)
        return res.status(404).json({ err: "Error with updating process" });
      return res.status(201).json(omit(updatedUser.toJSON(), "password"));
    } catch (error: any) {
      log.error({ err: error.message });
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
      log.error({ err: error.message });
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
      log.error({ err: error.message });
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
      log.error({ err: error.message });
    }
  });

  app.post("/user-wishlist", async (req: Request, res: Response) => {
    try {
      const wishlist = await service.WishlistItems(
        "6560a0f01c56d04cef3c85f6",
        req.body
      );

      if (!wishlist)
        return res.status(404).json({ err: "Error with adding wishlist item" });

      return res.status(201).json(wishlist);
    } catch (error: any) {
      log.error({ err: error.message });
      return res.status(400).json({ err: error.message });
    }
  });

  app.post("/user-cart", async (req: Request, res: Response) => {
    try {
      const user = await service.ManageCart(
        "6560a0f01c56d04cef3c85f6",
        req.body
      );
      if (!user)
        return res
          .status(404)
          .json({ err: "Error with fetching user with cart" });
      return res.status(201).json(user);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });

  app.post("/user-order", async (req: Request, res: Response) => {
    try {
      const user = await service.ManageOrder(
        "6560a0f01c56d04cef3c85f6",
        req.body
      );
      if (!user)
        return res
          .status(404)
          .json({ err: "Error with servicing user with order" });
      return res.status(201).json(user);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });

  app.post("/user-review", async (req: Request, res: Response) => {
    try {
      const user = await service.ManageReview(
        "6560a0f01c56d04cef3c85f6",
        req.body
      );
      if (!user)
        return res.status(404).json({
          err: "Error with servicing user with reviews on the products",
        });
      return res.status(201).json(user);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });

  app.delete("/log_out", async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.sendStatus(204);
    } catch (error: any) {
      return res.status(500).json({ err: error.message });
    }
  });
};

export default api;
