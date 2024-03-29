import { Application, Response, Request, query } from "express";
import CustomerService from "../services/vendor.services";
import { signWihtJWT, verifyJWT } from "../utils/jwt.utils";
import config from "../../config/default";
import { omit } from "lodash";
import { deserializeUser } from "./middleware/deserializeUser";
import { requestUser } from "./middleware/requestUser";
import {
  CreateAddressSchema,
  UpdateAddressSchema,
} from "./middleware/validation/address.validation";
import {
  CreateVendorSchema,
  UpdateVendorSchema,
} from "./middleware/validation/vendor.validation";
import {
  CreateTeamMemberSchema,
  UpdateTeamMemberSchema,
} from "./middleware/validation/team.validation";
import { Channel } from "amqplib";
import { PublishMessage, SubscribeMessage } from "../utils/rabbitMQ.utils";
import { validateIncomingData } from "./middleware/validateResources";
import ApiErrorHandler from "./apiErrorHandler";
import { CreateSessionSchema } from "./middleware/validation/session.validation";
import { SocialMediaSchema } from "./middleware/validation/socialUrls.validation";
import {
  BioValidation,
  workingDaysValidation,
} from "./middleware/validation/additional.validation";
import { generateNewAccessToken } from "../utils/token.utils";

const api = (app: Application, channel: Channel) => {
  const service = new CustomerService();

  SubscribeMessage(channel, config.vendor_queue, config.vendor_binding_key);

  //register
  app.post(
    "/register",
    validateIncomingData(CreateVendorSchema),
    async (req: Request, res: Response) => {
      try {
        const newVendor = await service.SignUp(req.body);
        if (!newVendor)
          return res.status(404).json({ err: "Error with Sign Up" });
        return res.status(201).json(omit(newVendor.toJSON(), "password"));
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //login & create access and refresh tokens
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
        const { vendor, newSession } = session;

        //create an access token
        const accessToken = signWihtJWT(
          { vendor: vendor._id, type: "vendor", session: newSession._id },
          { expiresIn: 1800 }
        );

        //create a refresh token
        const refreshToken = signWihtJWT(
          { vendor: vendor._id, type: "vendor", session: newSession._id },
          { expiresIn: 86400 }
        );

        res.cookie("vendor-accessToken", accessToken, {
          maxAge: 3.154e10,
          httpOnly: true,
          domain: "localhost",
          path: "/",
          sameSite: "strict",
          secure: false,
        });

        res.cookie("vendor-refreshToken", refreshToken, {
          maxAge: 3.154e10,
          httpOnly: true,
          domain: "localhost",
          path: "/",
          sameSite: "strict",
          secure: false,
        });
        return res
          .status(201)
          .json({ vendor: omit(vendor.toJSON(), "password"), ttl: 1800 });
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //get vendor's feedback based on provided query
  app.get("/vendor-feeds/:vendorId", async (req: Request, res: Response) => {
    try {
      const vendorId = req.params.vendorId;
      const amount =
        typeof req.query.amount === "string"
          ? parseInt(req.query.amount, 10)
          : 0;

      if (!query) return res.status(400).json({ msg: "Bad request" });

      const vendor = await service.VendorDataService(vendorId, amount);

      if (vendor === null)
        return res.status(404).json({ err: "Vendor not found" });

      return res.status(200).json(vendor);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  //retrieving all vendors
  app.get("/vendor", async (req: Request, res: Response) => {
    try {
      const vendors = await service.GetAllvendors();
      if (!vendors)
        return res.status(404).json({
          err: "Error with retrieving all vendors",
        });
      return res.status(200).json(vendors);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  //for customers
  app.get("/find-vendor/:vendorId", async (req: Request, res: Response) => {
    try {
      const vendorId = req.params.vendorId;
      const vendor = await service.FindVendor(vendorId);
      if (!vendor)
        return res.status(404).json({ err: "Error with fetching vendor" });

      return res.status(201).json(omit(vendor.toJSON(), "password"));
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  //the function retrieves feedbacks based on provided page for customers
  app.get(
    "/vendor-feedbacks/:vendorId",
    async (req: Request, res: Response) => {
      try {
        const vendorId = req.params.vendorId;
        const page = req.query.page
          ? parseInt(req.query.page as string, 10)
          : null;

        if (!page || isNaN(page))
          return res.status(400).json({ error: "Invalid page number" });

        const result = await service.GetVendorsFeedsService(vendorId, page);

        if (!result)
          return res.status(404).json({
            err: "Error with fetching vendor's page based on receiving page number",
          });

        return res.status(201).json(result);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //the function returns vendor's information for order based on address (query)
  app.get("/find-vendor-for-order", async (req: Request, res: Response) => {
    try {
      const address =
        typeof req.query.address === "string" ? req.query.address : "";

      const vendor = await service.FindVendorForOrder(address);
      if (!vendor)
        return res.status(404).json({ err: "Error with fetching vendor" });

      return res.status(201).json(vendor);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  //the function defined top vendors based on its orders
  app.get("/top-vendors", async (req: Request, res: Response) => {
    try {
      const topVendors = await service.GetTopVendorsService();
      if (topVendors == null)
        return res.status(404).json({ err: "Error with fetching vendor" });

      return res.status(201).json(topVendors);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  //retrieve vendor's gallery for customer
  app.get("/vendor-gallery/:vendorId", async (req: Request, res: Response) => {
    try {
      const vendorId = req.params.vendorId;
      const vendorGallery = await service.GetGallery(vendorId);
      if (!vendorGallery)
        return res
          .status(404)
          .json({ err: "Error with retrieve vendor with its gallery" });

      return res.status(200).json(vendorGallery);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });

  //retrieve vendor's food for customer
  app.get("/vendor-products/:vendorId", async (req: Request, res: Response) => {
    try {
      const vendorId = req.params.vendorId;
      const foods = await service.GetFoodsService(vendorId);

      if (!foods)
        return res
          .status(404)
          .json({ err: "Error with retrieve vendor's with its " });

      return res.status(200).json(foods);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });

  //validate requests and creating a new token if it is necessary
  app.use([deserializeUser, requestUser]);

  //find specific vendor
  app.get("/find-vendor", async (req: Request, res: Response) => {
    try {
      const vendorId = res.locals.vendor.vendor;
      const vendor = await service.FindVendor(vendorId);
      if (!vendor)
        return res.status(404).json({ err: "Error with fetching vendor" });

      return res
        .status(201)
        .json({ vendor: omit(vendor.toJSON(), "password"), ttl: 1800 });
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  // the function handles couple of complex features for calculate some data information
  app.get("/vendor-dashboard", async (req: Request, res: Response) => {
    try {
      const vendorId = res.locals.vendor.vendor;
      const { field, time } = req.query;
      if (typeof field !== "string" || typeof time !== "string") {
        return res.status(400).json({
          err: "Invalid query parameters",
        });
      }

      const result = await service.DashboardDataService(vendorId, {
        field,
        time,
      });

      if (!result)
        return res.status(404).json({
          err: "Error with define the result for dashboard ===>" + field,
        });

      return res.status(200).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });

  // update vendor profile
  app.put(
    "/update-vendor",
    validateIncomingData(UpdateVendorSchema),
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const updatedUser = await service.UpdateVendorProfile(
          vendorId,
          req.body
        );
        if (!updatedUser)
          return res.status(404).json({ err: "Error with updating process" });

        const event = {
          type: "update_feedback_info",
          data: { vendorId, image: null, name: updatedUser.name },
        };
        if (channel) {
          PublishMessage(
            channel,
            config.customer_binding_key,
            JSON.stringify(event)
          );
        }

        return res.status(201).json(updatedUser);
      } catch (error: any) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //add new team member
  app.post(
    "/vendor-team",
    validateIncomingData(CreateTeamMemberSchema),
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const newVendorTeam = await service.TeamMembers(vendorId, req.body);

        if (!newVendorTeam)
          return res
            .status(404)
            .json({ msg: "Error while adding a new team member" });

        return res.status(201).json(newVendorTeam);
      } catch (error: any) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //remove team member from vendor
  app.delete("/vendor-team/:memberId", async (req: Request, res: Response) => {
    try {
      const vendorId = res.locals.vendor.vendor;
      const memberId = req.params.memberId;
      const updatedVendorMembers = await service.RemoveMemberService(
        vendorId,
        memberId
      );
      if (!updatedVendorMembers)
        return res
          .status(404)
          .json({ msg: "Error while Removing team member from vendor" });

      return res.status(201).json(updatedVendorMembers);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });

  // add address
  app.post(
    "/add-vendor-address",
    validateIncomingData(CreateAddressSchema),
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const updatedVendorTeam = await service.AddVendorAddressService(
          vendorId,
          req.body
        );
        if (!updatedVendorTeam)
          return res
            .status(404)
            .json({ err: "Error while addig the vendor's address" });
        return res.status(201).json(updatedVendorTeam);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  // createa bio
  app.post(
    "/vendor-bio",
    validateIncomingData(BioValidation),
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const addAdditionalInfo = await service.AddAdditionalInfoService(
          vendorId,
          req.body
        );
        if (!addAdditionalInfo)
          return res.status(404).json("Could not added additional info");

        return res.status(201).json(addAdditionalInfo);
      } catch (error: any) {
        if (error.message === "Expired refresh token") {
          return res.status(401).json({ error: "Refresh token expired" });
        } else if (error.message === "Invalid refresh token") {
          return res.status(401).json({ error: "Invalid refresh token" });
        }
      }
    }
  );
  // define working hours
  app.post(
    "/working-hrs",
    validateIncomingData(workingDaysValidation),
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const workingHrs = await service.addWorkingHrsService(
          vendorId,
          req.body
        );
        if (!workingHrs)
          return res
            .status(404)
            .json({ msg: "Error while adding working hours" });

        return res.status(201).json(workingHrs);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //update vendor's profile image
  app.put("/vendor-profile", async (req: Request, res: Response) => {
    try {
      const vendorId = res.locals.vendor.vendor;
      const photoTitle = req.body.photoTitle;
      const vendorImage = await service.UpdateProfileService(
        vendorId,
        photoTitle
      );
      if (!vendorImage)
        return res
          .status(404)
          .json({ err: "Error while updating vendor's profile image" });

      //we are creating the event to send update information to the customer server
      const event = {
        type: "update_feedback_info",
        data: { vendorId, image: photoTitle, name: null },
      };

      if (channel) {
        PublishMessage(
          channel,
          config.customer_binding_key,
          JSON.stringify(event)
        );
      }
      return res.status(200).json(vendorImage);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });

  //retrieve vendor's team members
  app.get("/vendor-team", async (req: Request, res: Response) => {
    try {
      const vendorId = res.locals.vendor.vendor;
      const vendorGallery = await service.GetGallery(vendorId);
      if (!vendorGallery)
        return res
          .status(404)
          .json({ err: "Error with retrieve vendor with its gallery" });

      return res.status(200).json(vendorGallery);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });

  //the function has two capabilities, so it take as a query keyword which help detect which capability it should perform
  app.get("/vendor-orders", async (req: Request, res: Response) => {
    try {
      const withCustomerInfo = req.query.withCustomerInfo === "true";
      const vendorId = res.locals.vendor.vendor;
      const vendorOrders = await service.GetVendorOrdersService(
        vendorId,
        withCustomerInfo
      );
      if (!vendorOrders)
        return res
          .status(404)
          .json({ err: "Error with retrieve vendor with its orders" });
      return res.status(200).json(vendorOrders);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });

  // define vendor's top customers based on vendor's orders
  app.get("/vendor-top-customers", async (req: Request, res: Response) => {
    try {
      const vendorId = res.locals.vendor.vendor;
      const vendorOrders = await service.GetTopCustomersService(vendorId);

      if (vendorOrders === null)
        return res
          .status(404)
          .json({ err: "Error with retrieve vendor with its orders" });

      return res.status(200).json(vendorOrders);
    } catch (error: any) {
      ApiErrorHandler(error, res);
    }
  });

  //returns order's items based on provided order's id
  app.get(
    "/vendor-order-items/:orderId",
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const orderId = parseInt(req.params.orderId);

        const vendorOrders = await service.GetVendorOrderItemsService(
          vendorId,
          orderId
        );
        if (!vendorOrders)
          return res
            .status(404)
            .json({ err: "Error with retrieve vendor with its orders" });

        return res.status(200).json(vendorOrders);
      } catch (error: any) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //add social urls
  app.post(
    "/social-url",
    validateIncomingData(SocialMediaSchema),
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const result = await service.AddSocialUrlService(vendorId, req.body);
        if (!result)
          return res.status(400).json({ msg: "Error while adding social url" });

        return res.status(201).json(result);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );
  //remove social urls
  app.delete("/social-url/:title", async (req: Request, res: Response) => {
    try {
      const vendorId = res.locals.vendor.vendor;
      const title = req.params.title;
      const result = await service.RemoveSocialUrlService(vendorId, title);
      if (!result)
        return res.status(400).json({ msg: "Error while removing social url" });

      return res.status(201).json(result);
    } catch (error) {
      ApiErrorHandler(error, res);
    }
  });
  // refresh access token
  app.post("/refresh-token", async (req: Request, res: Response) => {
    try {
      const refresh = req.cookies["vendor-refreshToken"];
      if (!refresh)
        return res.status(400).json({ msg: "Invalid Refresh Token" });

      const { token, error } = await generateNewAccessToken(refresh);

      if (error) return res.status(401).json({ error: error });

      res.cookie("vendor-accessToken", token, {
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
  // logs out
  app.delete("/log_out", async (req: Request, res: Response) => {
    try {
      res.clearCookie("vendor-refreshToken");
      res.clearCookie("vendor-accessToken");
      return res.status(201).json(null);
    } catch (error) {
      return res.status(500).json({ err: error });
    }
  });
};

export default api;
