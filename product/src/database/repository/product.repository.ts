import log from "../../utils/logger";
import initialize from "../initialize";
import { ProductDocsType, ProductInputType } from "../types/types.product";

class ProductRepo {
  async createProduct(input: ProductInputType) {
    try {
      return await initialize.Product.create(input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async getProducts() {
    try {
      return await initialize.Product.findAll({
        include: [{ model: initialize.Feedbacks, as: "feedbacks" }],
      });
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async getProductById(id: number) {
    try {
      return await initialize.Product.findByPk(id, {
        include: [{ model: initialize.Feedbacks, as: "feedbacks" }],
      });
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async updateProduct(id: number, input: ProductDocsType) {
    try {
      const [updatedFeeds] = await initialize.Product.update(input, {
        where: { id },
      });
      if (updatedFeeds === 0) return log.error({ err: "No changes in rows" });
      return await initialize.Product.findByPk(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async deleteProduct(id: number) {
    try {
      return await initialize.Product.destroy({ where: { id } });
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
}

export default ProductRepo;
