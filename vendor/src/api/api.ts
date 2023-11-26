import { Application, Response, Request } from "express";
import CustomerService from "../services/vendor.services";
import log from "../utils/logger";
import { signWihtJWT } from "../utils/jwt.utils";
import config from "../../config/default";
import { omit } from "lodash";
import { deserializeUser } from "./middleware/deserializeUser";
import { requestUser } from "./middleware/requestUser";
import {
  CreateAddressSchemaType,
  UpdateAddressSchemaType,
} from "./../database/validation/address.validation";
import {
  ReadVendorSchemaType,
  UpdateVendorSchemaType,
} from "../database/validation/vendor.validation";
import {
  CreateTeamMemberSchemaType,
  UpdateTeamMemberSchemaType,
} from "../database/validation/team.validation";
const api = (app: Application) => {
  const service = new CustomerService();

  //register
  app.post("/register", async (req: Request, res: Response) => {
    try {
      const newVendor = await service.SignUp(req.body);
      if (!newVendor)
        return res.status(404).json({ err: "Error with Sign Up" });
      return res.status(201).json(omit(newVendor.toJSON(), "password"));
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });

  //login & create access and refresh tokens
  app.post("/login", async (req: Request, res: Response) => {
    try {
      const session = await service.SessionService(
        req.body,
        req.get("user-agent") || ""
      );

      if (!session) return res.status(404).json({ err: "Wrong credentials" });
      //create an access token
      const accessToken = signWihtJWT(
        { vendor: session.vendor, session: session._id },
        { expiresIn: config.accessTokenTtl }
      );

      //create a refresh token
      const refreshToken = signWihtJWT(
        { vendor: session.vendor, session: session._id },
        { expiresIn: config.accessRefreshTtl }
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
      return res.status(201).json({ refreshToken, accessToken });
    } catch (error: any) {
      return res.status(400).json({ err: error.message });
    }
  });

  //validate requests and creating a new token if it is necessary
  app.use([deserializeUser, requestUser]);

  // add address into vendor
  app.post(
    "/address",
    async (
      req: Request<{}, {}, CreateAddressSchemaType["body"]>,
      res: Response
    ) => {
      try {
        const vendor = res.locals.user;
        console.log({ vendor, msg: "repo" });
        const address = await service.VendorAddress(vendor.vendor, req.body);
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

  // update vendor profile
  app.put(
    "/update-vendor/:vendorId",
    async (
      req: Request<
        UpdateVendorSchemaType["params"],
        {},
        UpdateVendorSchemaType["body"]
      >,
      res: Response
    ) => {
      try {
        const { vendorId } = req.params;
        const updatedUser = await service.UpdateVendorProfile(
          vendorId,
          req.body
        );
        if (!updatedUser)
          return res.status(404).json({ err: "Error with updating process" });
        return res.status(201).json(omit(updatedUser.toJSON(), "password"));
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );

  //update vendor address
  app.put(
    "/update-address/:vendorId",
    async (
      req: Request<
        UpdateAddressSchemaType["params"],
        {},
        UpdateAddressSchemaType["body"]
      >,
      res: Response
    ) => {
      try {
        const { vendorId } = req.params;
        const updatedAddress = await service.UpdateVendorAddress(
          vendorId,
          req.body
        );
        if (!updatedAddress)
          return res.status(404).json({ err: "Error with updating process" });
        return res.status(201).json(updatedAddress);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );

  //find specific vendor
  app.get(
    "/find-vendor/:vendorId",
    async (req: Request<ReadVendorSchemaType["params"]>, res: Response) => {
      try {
        const { vendorId } = req.params;
        const vendor = await service.FindVendor(vendorId);
        if (!vendor)
          return res.status(404).json({ err: "Error with fetching vendor" });

        return res.status(201).json(vendor);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );

  //get vendor's data
  app.get(
    "/vendor-spec-data/:vendorId",
    async (req: Request<ReadVendorSchemaType["params"]>, res: Response) => {
      try {
        const { vendorId } = req.params;
        const field = Array.isArray(req.query.field)
          ? (req.query.field[0] as string)
          : (req.query.field as string);

        if (!field) return res.status(400).json({ msg: "Bad request" });

        const vendor = await service.VendorData(vendorId, field);

        if (vendor === null)
          return res.status(404).json({ err: "Vendor not found" });

        return res.status(200).json(vendor);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );

  //add new team member
  app.post(
    "/vendor-team",
    async (
      req: Request<{}, {}, CreateTeamMemberSchemaType["body"]>,
      res: Response
    ) => {
      try {
        const vendor = res.locals.user;
        const newVendorTeam = await service.TeamMembers(
          vendor.vendor,
          req.body
        );
        if (!newVendorTeam)
          return res
            .status(404)
            .json({ msg: "Error while adding a new team member" });

        return res.status(201).json(newVendorTeam);
      } catch (error: any) {
        log.error({ err: error.message });
        return res.status(400).json({ err: error.message });
      }
    }
  );

  // update team member
  app.put(
    "/vendor-team/:vendorId",
    async (
      req: Request<
        UpdateTeamMemberSchemaType["params"],
        {},
        UpdateTeamMemberSchemaType["body"]
      >,
      res: Response
    ) => {
      try {
        const { vendorId } = req.params;
        const updatedVendorTeam = await service.UpdateUpdateTeamMember(
          vendorId,
          req.body
        );
        if (!updatedVendorTeam)
          return res
            .status(404)
            .json({ err: "Error with updating the vendor's " });
        return res.status(201).json(updatedVendorTeam);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );

  //retrieve vendor's gallery
  app.post(
    "/vendor-gallery",
    async (req: Request<ReadVendorSchemaType["params"]>, res: Response) => {
      try {
        const { vendorId } = req.params;
        const vendorGallery = await service.GetGallery(vendorId);
        if (!vendorGallery)
          return res
            .status(404)
            .json({ err: "Error with retrieve vendor with its gallery" });
        return res.status(200).json(vendorGallery);
      } catch (error: any) {
        log.error({ err: error.message });
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
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });

  app.delete("/log_out", async (req: Request, res: Response) => {
    try {
      res.clearCookie("vendor-refreshToken");
      res.clearCookie("vendor-accessToken");
      return res.sendStatus(204);
    } catch (error: any) {
      return res.status(500).json({ err: error.message });
    }
  });
};

export default api;
