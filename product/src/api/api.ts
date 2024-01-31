import { Application } from "express";
import ProductService from "../services/product.services";
import { Request, Response } from "express";
import MainCatService from "../services/mainCategory.services";
import SubCatService from "../services/subCategory.services";
import { verifyJWT } from "./middleware/verifyToken";
import { IncomingMainCatValidation } from "./middleware/validation/mainCategory.validation";
import { IncomingSubCatValidation } from "./middleware/validation/subCategory.validation";
import { IncomingProductValidation } from "./middleware/validation/product.validation";
import { PublishMessage, SubscriberMessage } from "../utils/rabbitMQ.utils";
import config from "../../config";
import { Channel } from "amqplib";
import { validateIncomingData } from "./middleware/validateIncomingData";
import { ApiErrorHandler } from "./ApiErrorHandler";
import { takeUrl } from "../utils/makeRequestWithRetries";

const api = async (app: Application, channel: Channel) => {
  const Mservice = new MainCatService();
  const Sservice = new SubCatService();
  const Pservice = new ProductService();

  SubscriberMessage(channel, config.product_queue, config.product_binding_key);

  //main category

  //create main categories
  app.post(
    "/main-cat",
    verifyJWT, // for creating a main categories access token is required
    validateIncomingData(IncomingMainCatValidation), //middleware
    async (req: Request, res: Response) => {
      try {
        const { title, desc, image } = req.body;
        const mainCat = await Mservice.createMainCatService({
          title,
          desc,
          image,
        });

        if (!mainCat)
          return res
            .status(400)
            .json({ msg: "Error while creating a new main category" });

        return res.status(201).json(mainCat);
      } catch (error: any) {
        ApiErrorHandler(res, error);
      }
    }
  );

  //returns all main cats
  app.get("/main-cat", async (req: Request, res: Response) => {
    try {
      const mainCats = await Mservice.getMainCatsService();
      if (!mainCats)
        return res.status(404).json({ msg: "Error while fetching mainCats" });
      return res.status(200).json(mainCats);
    } catch (error) {
      ApiErrorHandler(res, error);
    }
  });

  //sub category
  app.post(
    "/sub-cat",
    verifyJWT,
    validateIncomingData(IncomingSubCatValidation),
    async (req: Request, res: Response) => {
      try {
        const vendorId = req.user?.vendor;
        if (!vendorId)
          return res.status(404).json({ msg: "You have not a permission" });
        const newSubCat = await Sservice.createSubCatService(req.body);
        if (!newSubCat)
          return res
            .status(404)
            .json({ msg: "Error while creating a new sub cat" });
        return res.status(201).json(newSubCat);
      } catch (error) {
        ApiErrorHandler(res, error);
      }
    }
  );

  //returns all sub cats
  app.get("/sub-cat", async (req: Request, res: Response) => {
    try {
      const allSubCategories = await Sservice.getSubCatsService();
      if (!allSubCategories)
        return res
          .status(404)
          .json({ msg: "Error while a fetching all sub cat" });
      return res.status(200).json(allSubCategories);
    } catch (error) {
      ApiErrorHandler(res, error);
    }
  });

  //this function returns sub categories basedo on main category's ID
  app.get("/main-subcat/:_id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params._id);
      const subCategory = await Sservice.getMainCatSubCatsService(id);
      if (!subCategory)
        return res
          .status(404)
          .json({ msg: "Error while a fetching the sub cat" });
      return res.status(200).json(subCategory);
    } catch (error) {
      ApiErrorHandler(res, error);
    }
  });

  //returns all sub cats only for specific vendor
  app.get("/vendor-sub-cat", verifyJWT, async (req: Request, res: Response) => {
    try {
      const vendorId = req.user?.vendor;
      if (!vendorId) return res.status(404).json({ msg: "Vendor Not Found" });
      const allVendorSubCategories = await Sservice.getVendorSubCatsService(
        vendorId
      );
      if (!allVendorSubCategories)
        return res
          .status(404)
          .json({ msg: "Error while a fetching all sub cat" });
      return res.status(200).json(allVendorSubCategories);
    } catch (error) {
      ApiErrorHandler(res, error);
    }
  });

  //create a new product
  app.post(
    "/product",
    verifyJWT,
    validateIncomingData(IncomingProductValidation),
    async (req: Request, res: Response) => {
      try {
        const vendorId = req.user?.vendor; // purpose ==> to define which vendor should receives
        const newProduct = await Pservice.createProductService(req.body);

        if (!newProduct)
          return res
            .status(404)
            .json({ msg: "Error while creating a new product" });

        const { id, ...other } = newProduct.dataValues;

        const event = {
          type: "add_food_in_vendor",
          data: {
            ...other,
            foodId: id,
            forVendor: vendorId,
          },
        };

        if (channel) {
          PublishMessage(
            channel,
            config.vendor_binding_key,
            JSON.stringify(event)
          );
        }

        return res.status(201).json(newProduct);
      } catch (error) {
        ApiErrorHandler(res, error);
      }
    }
  );

  // this function has paginaton logic, it used for customers
  app.get("/product/:page", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.params.page);
      const products = await Pservice.getProductsService(page);
      if (!products)
        return res
          .status(404)
          .json({ msg: "Error while fetching all products" });
      return res.status(200).json(products);
    } catch (error) {
      ApiErrorHandler(res, error);
    }
  });

  //this function returns all feedbacks based on provided ID
  app.get("/product-feeds/:productId", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      const feeds = await Pservice.getProductsFeedsService(productId);
      if (!feeds)
        return res
          .status(404)
          .json({ msg: "Error while fetching all products" });
      return res.status(200).json(feeds);
    } catch (error) {
      ApiErrorHandler(res, error);
    }
  });

  //the function's capability is to gain all specific vendor's food and return it
  app.get(
    "/vendor-products/:vendorName",
    async (req: Request, res: Response) => {
      try {
        const vendorName = req.params.vendorName;

        const products = await Pservice.getVendorsProductsService(vendorName);
        if (!products)
          return res
            .status(404)
            .json({ msg: "Error while fetching all products" });
        return res.status(200).json(products);
      } catch (error) {
        ApiErrorHandler(res, error);
      }
    }
  );
  // food length for admin to calculate which food is more required
  app.get("/foods-length", async (req: Request, res: Response) => {
    try {
      const products = await Pservice.getFoodsLengthService();
      if (!products)
        return res
          .status(404)
          .json({ msg: "Error while fetching all products" });
      return res.status(200).json(products);
    } catch (error) {
      ApiErrorHandler(res, error);
    }
  });

  app.delete(
    "/product/:_id",
    verifyJWT,
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        const removedFood = await Pservice.deleteProductService(id);

        if (!removedFood)
          return res
            .status(404)
            .json({ msg: "Error while deleting a product" });

        const event = {
          type: "delete_food_in_vendor",
          data: {
            foodId: id,
          },
        };

        if (channel) {
          PublishMessage(
            channel,
            config.vendor_binding_key,
            JSON.stringify(event)
          );
        }

        return res.status(201).json({ msg: "Successfully removed..." });
      } catch (error) {
        ApiErrorHandler(res, error);
      }
    }
  );

  //this function handles to adding process of food to the customer's wishlist
  app.post("/add-product-to-wishlist", async (req: Request, res: Response) => {
    try {
      const { productId, userId } = req.body;
      const product = await Pservice.getProductByIdService(productId);
      if (!product) return res.status(404).json({ msg: "Not found product" });

      const { id, image, title, price, desc } = product;
      const imgUrl = await takeUrl(image);

      //so if adding food into wishlist capability is handled by product service, we need to send the food info to the customer server
      const event = {
        type: "add_product_to_wishlist",
        data: {
          id,
          userId,
          title,
          desc,
          image,
          price,
        },
      };

      if (channel) {
        PublishMessage(
          channel,
          config.customer_binding_key,
          JSON.stringify(event)
        );
        return res
          .status(201)
          .json({ id, userId, title, desc, image: imgUrl, price });
      } else {
        return res.status(503).json({ msg: "Service Unavailable" });
      }
    } catch (error) {
      ApiErrorHandler(res, error);
    }
  });

  app.post("/add-product-to-cart", async (req: Request, res: Response) => {
    try {
      const { productId, userId, unit } = req.body;
      const product = await Pservice.getProductByIdService(productId);
      if (!product) return res.status(404).json({ msg: "Not found product" });

      const { id, image, title, price, address } = product;
      const event = {
        type: "add_product_to_cart",
        data: {
          id,
          userId,
          title,
          image,
          price,
          address,
          unit,
        },
      };

      const imgUrl = await takeUrl(image);

      if (channel) {
        PublishMessage(
          channel,
          config.customer_binding_key,
          JSON.stringify(event)
        );

        return res
          .status(201)
          .json({ id, title, image: image, url: imgUrl, price, address, unit });
      } else {
        return res.status(503).json({ msg: "Service Unavailable" });
      }
    } catch (error) {
      ApiErrorHandler(res, error);
    }
  });
};

export default api;
