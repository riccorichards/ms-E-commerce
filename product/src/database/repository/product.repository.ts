import { error } from "console";
import {
  IncomingProductType,
  IncomingProductUpdateValidationType,
} from "../../api/middleware/validation/product.validation";
import log from "../../utils/logger";
import {
  makeRequestWithRetries,
  takeUrl,
} from "../../utils/makeRequestWithRetries";
import initialize from "../initialize";

class ProductRepo {
  async createProduct(input: IncomingProductType["body"]) {
    try {
      return await initialize.Product.create({ ...input, url: null });
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
        limit,
        offset,
      });
      const totalPages = Math.ceil(totalProductsCount / limit);

      const result = rows.map(async (product) => {
        const image = await takeUrl(product.image);
        product.url = image;
        return product;
      });

      return {
        products: await Promise.all(result),
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

  async getProductsFeeds(productId: number) {
    try {
      let feeds = await initialize.Feedbacks.findAll({
        where: { targetId: productId },
      });

      if (!feeds) throw new Error("Food data is not available or Not found");

      feeds = feeds.sort((a, b) => b.id - a.id);

      const result = feeds.map(async (feed) => {
        const image = await takeUrl(feed.authorImg || "");

        feed.authorImg = image;

        return feed;
      });
      const feedResult = await Promise.all(result);

      return feedResult.map((feed) => {
        return {
          image: feed.authorImg,
          feed: feed.review,
          id: feed.id,
        };
      });
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getVendorsProducts(vendorName: string) {
    try {
      let foods = await initialize.Product.findAll({
        where: { vendor_name: vendorName },
      });
      if (!foods) throw new Error("Food data is not available or Not found");
      foods = foods.sort((a, b) => b.id - a.id);
      const result = foods.map(async (product) => {
        const image = await takeUrl(product.image);
        product.url = image;
        return product;
      });
      return await Promise.all(result.slice(0, 5));
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
      return await initialize.Product.findByPk(id);
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
