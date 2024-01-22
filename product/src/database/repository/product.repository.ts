import {
  IncomingProductType,
  IncomingProductUpdateValidationType,
} from "../../api/middleware/validation/product.validation";
import log from "../../utils/logger";
import initialize from "../initialize";

class ProductRepo {
  async createProduct(input: IncomingProductType["body"]) {
    try {
      return await initialize.Product.create(input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getProducts(page: number) {
    try {
      const limit = 5;
      const offset = (page - 1) * limit;

      const totalProductsCount = await initialize.Product.count();

      const { rows } = await initialize.Product.findAndCountAll({
        include: [{ model: initialize.Feedbacks, as: "feedbacks" }],
        limit,
        offset,
      });
      const totalPages = Math.ceil(totalProductsCount / limit);

      return {
        products: rows,
        pagination: {
          page,
          totalPages,
          pageSize: limit,
          totalCount: totalProductsCount,
        },
      };
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getVendorsProducts(vendorName: string) {
    try {
      return await initialize.Product.findAll({
        where: { vendor_name: vendorName },
      });
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getFoodsLength() {
    try {
      return (await initialize.Product.findAll()).length;
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

  async updateProduct(
    id: number,
    input: IncomingProductUpdateValidationType["body"]
  ) {
    try {
      const [updatedProduct] = await initialize.Product.update(input, {
        where: { id },
      });
      if (updatedProduct === 0) return log.error({ err: "No changes in rows" });
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
