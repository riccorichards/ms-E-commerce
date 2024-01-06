import { Application, Response, Request } from "express";
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
import { SubscribeMessage } from "../utils/rabbitMQ.utils";
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
          .json({ vendor: omit(vendor.toJSON(), "password"), ttl: 60 });
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //get vendor's data
  app.get(
    "/vendor-spec-data",
    [deserializeUser, requestUser],
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const field = Array.isArray(req.query.field)
          ? (req.query.field[0] as string)
          : (req.query.field as string);

        if (!field) return res.status(400).json({ msg: "Bad request" });

        const vendor = await service.VendorData(vendorId, field);

        if (vendor === null)
          return res.status(404).json({ err: "Vendor not found" });

        return res.status(200).json(vendor);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

  app.get(
    "/additional-info/:vendorId?",
    async (req: Request<{ vendorId: string }>, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor || req.params.vendorId;

        if (!vendorId) {
          return res.status(400).json({ msg: "Vendor ID is required." });
        }
        const vendor = await service.GetAdditionalInfoService(vendorId);
        if (!vendor)
          return res.status(400).json({
            msg: "Vendor's additional info not found.",
          });

        return res.status(200).json(vendor);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

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

  // add address into vendor
  app.post(
    "/address",
    validateIncomingData(CreateAddressSchema),
    async (req: Request, res: Response) => {
      try {
        const vendor = res.locals.vendor.vendor;
        const addAddressIntoVendor = await service.VendorAddress(
          vendor,
          req.body
        );
        if (!addAddressIntoVendor)
          return res
            .status(404)
            .json({ err: "Error with adding address information => (API)" });
        return res
          .status(201)
          .json(omit(addAddressIntoVendor.toJSON(), "password"));
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

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
        return res.status(201).json(updatedUser);
      } catch (error: any) {
        ApiErrorHandler(error, res);
      }
    }
  );

  //update vendor address
  app.put(
    "/update-address",
    validateIncomingData(UpdateAddressSchema),
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const updatedAddress = await service.UpdateVendorAddress(
          vendorId,
          req.body
        );
        if (!updatedAddress)
          return res.status(404).json({ err: "Error with updating process" });
        return res.status(201).json(updatedAddress);
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

  // update team member
  app.put(
    "/update-vendor-team",
    validateIncomingData(UpdateTeamMemberSchema),
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const updatedVendorTeam = await service.UpdateUpdateTeamMember(
          vendorId,
          req.body
        );
        if (!updatedVendorTeam)
          return res
            .status(404)
            .json({ err: "Error with updating the vendor's " });
        return res.status(201).json(updatedVendorTeam);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );
  //
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

  app.put(
    "/update-bio",
    validateIncomingData(BioValidation),
    async (req: Request, res: Response) => {
      try {
        const vendorId = res.locals.vendor.vendor;
        const addAdditionalInfo = await service.UpdateAdditionalInfoService(
          vendorId,
          req.body
        );
        if (!addAdditionalInfo)
          return res.status(404).json("Could not updated additional info");

        return res.status(201).json(addAdditionalInfo);
      } catch (error) {
        ApiErrorHandler(error, res);
      }
    }
  );

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

  //retrieve vendor's gallery
  app.get("/vendor-gallery", async (req: Request, res: Response) => {
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

  app.post("/refresh-token", async (req: Request, res: Response) => {
    try {
      const refresh = req.cookies["vendor-refreshToken"];
      if (!refresh)
        return res.status(400).json({ msg: "Invalid Refresh Token" });

      const result = await generateNewAccessToken(refresh);
      const { token, error } = result;
      if (error)
        return res.status(400).json({ msg: "Error while removing social url" });

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
