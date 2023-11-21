import { Application } from "express";
import ProductService from "../services/product.services";
import { Request, Response } from "express";
import log from "../utils/logger";
import {
  CreateProductType,
  DeleteProductType,
  ReadProductType,
  UpdateProductType,
} from "../database/validation/product.validation";
import {
  CreateMainCatType,
  DeleteMainCatType,
  ReadMainCatType,
  UpdateMainCatType,
} from "../database/validation/mainCategory.validation";
import MainCatService from "../services/mainCategory.services";
import SubCatService from "../services/subCategory.services";
import {
  CreateSubCatType,
  ReadSubCatType,
  UpdateSubCatType,
} from "../database/validation/subCategory.validation";
import FeedbacksService from "../services/productReview.services";
import {
  CreateReviewType,
  DeleteReviewType,
  ReadReviewType,
  UpdateReviewType,
} from "../database/validation/feedbacks.validation";

const api = (app: Application) => {
  const Mservice = new MainCatService();
  const Sservice = new SubCatService();
  const Pservice = new ProductService();
  const Fservice = new FeedbacksService();

  //main category
  app.post(
    "/main-cat",
    async (req: Request<{}, {}, CreateMainCatType["body"]>, res: Response) => {
      try {
        const { title, desc } = req.body;

        const newProduct = await Mservice.createMainCatService({ title, desc });

        return res.status(201).json(newProduct);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.get("/main-cat", async (req: Request, res: Response) => {
    try {
      const products = await Mservice.getMainCatsService();

      return res.status(200).json(products);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });
  app.get(
    "/main-cat/:_id",
    async (req: Request<ReadMainCatType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        const product = await Mservice.getMainCatByIdService(id);
        return res.status(200).json(product);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.put(
    "/main-cat/:_id",
    async (req: Request<UpdateMainCatType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        const updatedProduct = await Mservice.updateMainCatService(
          id,
          req.body
        );

        return res.status(200).json(updatedProduct);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.delete(
    "/main-cat/:id",
    async (req: Request<DeleteMainCatType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        await Mservice.deleteMainCatService(id);

        return res.status(201).json({ msg: "Successfully Deleted..." });
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );

  //sub category
  app.post(
    "/sub-cat",
    async (req: Request<{}, {}, CreateSubCatType["body"]>, res: Response) => {
      try {
        const newSubCat = await Sservice.createSubCatService(req.body);
        return res.status(201).json(newSubCat);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.get("/sub-cat", async (req: Request, res: Response) => {
    try {
      const allSubCategories = await Sservice.getSubCatsService();
      return res.status(200).json(allSubCategories);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });
  app.get(
    "/sub-cat/:_id",
    async (req: Request<ReadSubCatType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        const subCategory = await Sservice.getSubCatByIdService(id);
        return res.status(200).json(subCategory);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.put(
    "/sub-cat/:_id",
    async (req: Request<UpdateSubCatType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        const updatedSubCategory = await Sservice.updateSubCatService(
          id,
          req.body
        );
        return res.status(201).json(updatedSubCategory);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.delete(
    "/sub-cat/:_id",
    async (req: Request<UpdateSubCatType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        await Sservice.deleteSubCatService(id);
        return res.status(201).json({ msg: "Successfully removed..." });
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );

  //product
  app.post(
    "/product",
    async (req: Request<{}, {}, CreateProductType["body"]>, res: Response) => {
      try {
        const newProduct = await Pservice.createProductService(req.body);
        return res.status(201).json(newProduct);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.get("/product", async (req: Request, res: Response) => {
    try {
      const products = await Pservice.getProductsService();
      return res.status(200).json(products);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });
  app.get(
    "/product/:_id",
    async (req: Request<ReadProductType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        const product = await Pservice.getProductByIdService(id);
        return res.status(200).json(product);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.put(
    "/product/:_id",
    async (req: Request<UpdateProductType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        const updatedProduct = await Pservice.updateProductService(
          id,
          req.body
        );
        return res.status(201).json(updatedProduct);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.delete(
    "/product/:_id",
    async (req: Request<DeleteProductType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        await Pservice.deleteProductService(id);
        return res.status(201).json({ msg: "Successfully removed..." });
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );

  //feedbacks
  app.post(
    "/feedback",
    async (req: Request<{}, {}, CreateReviewType["body"]>, res: Response) => {
      try {
        const newFeedback = await Fservice.createFeedbacksService(req.body);
        return res.status(201).json(newFeedback);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.get("/feedback", async (req: Request, res: Response) => {
    try {
      const feedbacks = await Fservice.getFeedbackssService();
      return res.status(200).json(feedbacks);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  });
  app.get(
    "/feedback/:_id",
    async (req: Request<ReadReviewType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        const product = await Fservice.getFeedbacksByIdService(id);
        return res.status(200).json(product);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.put(
    "/feedback/:_id",
    async (req: Request<UpdateReviewType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        const updatedFeedback = await Fservice.updateFeedbacksService(
          id,
          req.body
        );
        return res.status(201).json(updatedFeedback);
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
  app.delete(
    "/feedback/:_id",
    async (req: Request<DeleteReviewType["params"]>, res: Response) => {
      try {
        const id = parseInt(req.params._id);
        await Fservice.deleteFeedbacksService(id);
        return res.status(201).json({ msg: "Successfully removed..." });
      } catch (error: any) {
        log.error({ err: error.message });
      }
    }
  );
};

export default api;
