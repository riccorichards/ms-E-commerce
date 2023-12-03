import { Application } from "express";
import ProductService from "../services/product.services";
import { Request, Response } from "express";
import log from "../utils/logger";
import MainCatService from "../services/mainCategory.services";
import SubCatService from "../services/subCategory.services";
import { verifyJWT } from "./middleware/verifyToken";
import { ZodError } from "zod";
import { IncomingMainCatValidation } from "./middleware/validation/mainCategory.validation";
import { IncomingSubCatValidation } from "./middleware/validation/subCategory.validation";
import { IncomingProductValidation } from "./middleware/validation/product.validation";
import { PublishMessage, SubscriberMessage } from "../utils/rabbitMQ.utils";
import config from "../../config";
import { Channel } from "amqplib";

const api = async (app: Application, channel: Channel) => {
  const Mservice = new MainCatService();
  const Sservice = new SubCatService();
  const Pservice = new ProductService();

  SubscriberMessage(channel, config.product_queue, config.product_binding_key);

  app.use(verifyJWT);
  //main category

  app.post("/main-cat", async (req: Request, res: Response) => {
    try {
      IncomingMainCatValidation.parse(req.body);
      const { title, desc } = req.body;

      const mainCat = await Mservice.createMainCatService({ title, desc });

      if (!mainCat)
        return res
          .status(400)
          .json({ msg: "Error while creating a new main category" });

      return res.status(201).json(mainCat);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });

  app.get("/main-cat", async (req: Request, res: Response) => {
    try {
      const mainCat = await Mservice.getMainCatsService();
      if (!mainCat)
        return res.status(404).json({ msg: "Error while fetching mainCat" });
      return res.status(200).json(mainCat);
    } catch (error: any) {
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });

  app.get("/main-cat/:_id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params._id);
      const mainCat = await Mservice.getMainCatByIdService(id);
      if (!mainCat)
        return res
          .status(404)
          .json({ msg: "Error while fetching the main Cat" });
      return res.status(200).json(mainCat);
    } catch (error: any) {
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });

  app.put("/main-cat/:_id", async (req: Request, res: Response) => {
    try {
      IncomingMainCatValidation.parse(req.body);
      const id = parseInt(req.params._id);
      const updatedmainCat = await Mservice.updateMainCatService(id, req.body);

      if (!updatedmainCat)
        return res.status(404).json({ msg: "Error while updating main cat" });
      return res.status(200).json(updatedmainCat);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });

  app.delete("/main-cat/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params._id);
      await Mservice.deleteMainCatService(id);

      return res.status(201).json({ msg: "Successfully Deleted..." });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });

  //sub category
  app.post("/sub-cat", async (req: Request, res: Response) => {
    try {
      IncomingSubCatValidation.parse(req.body);
      const newSubCat = await Sservice.createSubCatService(req.body);
      if (!newSubCat)
        return res
          .status(404)
          .json({ msg: "Error while creating a new sub cat" });
      return res.status(201).json(newSubCat);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });

  app.get("/sub-cat", async (req: Request, res: Response) => {
    try {
      const allSubCategories = await Sservice.getSubCatsService();
      if (!allSubCategories)
        return res
          .status(404)
          .json({ msg: "Error while a fetching all sub cat" });
      return res.status(200).json(allSubCategories);
    } catch (error: any) {
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });
  app.get("/sub-cat/:_id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params._id);
      const subCategory = await Sservice.getSubCatByIdService(id);
      if (!subCategory)
        return res
          .status(404)
          .json({ msg: "Error while a fetching the sub cat" });
      return res.status(200).json(subCategory);
    } catch (error: any) {
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });

  app.put("/sub-cat/:_id", async (req: Request, res: Response) => {
    try {
      IncomingSubCatValidation.parse(req.body);
      const id = parseInt(req.params._id);
      const updatedSubCategory = await Sservice.updateSubCatService(
        id,
        req.body
      );
      if (!updatedSubCategory)
        return res
          .status(404)
          .json({ msg: "Error while a updating the sub cat" });
      return res.status(201).json(updatedSubCategory);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });

  app.delete("/sub-cat/:_id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params._id);
      await Sservice.deleteSubCatService(id);
      return res.status(201).json({ msg: "Successfully removed..." });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });

  //product
  app.post("/product", async (req: Request, res: Response) => {
    try {
      IncomingProductValidation.parse(req.body);
      const newProduct = await Pservice.createProductService(req.body);
      if (!newProduct)
        return res
          .status(404)
          .json({ msg: "Error while creating a new product" });
      return res.status(201).json(newProduct);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });
  app.get("/product", async (req: Request, res: Response) => {
    try {
      const products = await Pservice.getProductsService();
      if (!products)
        return res
          .status(404)
          .json({ msg: "Error while fetching all products" });
      return res.status(200).json(products);
    } catch (error: any) {
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });
  app.get("/product/:_id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params._id);
      const product = await Pservice.getProductByIdService(id);
      if (!product)
        return res.status(404).json({ msg: "Error while fetching a product" });
      return res.status(200).json(product);
    } catch (error: any) {
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });
  app.put("/product/:_id", async (req: Request, res: Response) => {
    try {
      IncomingProductValidation.parse(req.body);
      const id = parseInt(req.params._id);
      const updatedProduct = await Pservice.updateProductService(id, req.body);

      if (!updatedProduct)
        return res.status(404).json({ msg: "Error while updating a product" });
      return res.status(201).json(updatedProduct);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(404).json(error.errors);
      }
      log.error({ err: error.message });
      return res.status(500).json(error.message);
    }
  });

  app.delete("/product/:_id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params._id);
      await Pservice.deleteProductService(id);
      return res.status(201).json({ msg: "Successfully removed..." });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });

  app.post("/add-product-to-wishlist", async (req: Request, res: Response) => {
    try {
      const { productId, userId } = req.body;
      const product = await Pservice.getProductByIdService(productId);
      if (!product) return res.status(404).json({ msg: "Not found product" });

      const { id, image, title, price, desc } = product;
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
        return res.status(201).json({ msg: "Successfully added..." });
      } else {
        return res.status(503).json({ msg: "Service Unavailable" });
      }
    } catch (error: any) {
      log.error(error.Message);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  });

  app.post("/add-product-to-cart", async (req: Request, res: Response) => {
    try {
      const { productId, userId, unit } = req.body;
      const product = await Pservice.getProductByIdService(productId);
      if (!product) return res.status(404).json({ msg: "Not found product" });

      const { id, image, title, price, desc } = product;
      const event = {
        type: "add_product_to_cart",
        data: {
          id,
          userId,
          title,
          desc,
          image,
          price,
          unit,
        },
      };

      if (channel) {
        PublishMessage(
          channel,
          config.customer_binding_key,
          JSON.stringify(event)
        );
        return res.status(201).json({ msg: "Successfully added..." });
      } else {
        return res.status(503).json({ msg: "Service Unavailable" });
      }
    } catch (error: any) {
      log.error(error.Message);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  });
};

export default api;
