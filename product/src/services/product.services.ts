import { Channel, Message } from "amqplib";
import {
  IncomingProductType,
  IncomingProductUpdateValidationType,
} from "../api/middleware/validation/product.validation";
import ProductRepo from "../database/repository/product.repository";
import log from "../utils/logger";

class ProductService {
  private repository: ProductRepo;

  constructor() {
    this.repository = new ProductRepo();
  }

  async createProductService(input: IncomingProductType["body"]) {
    try {
      return await this.repository.createProduct(input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getProductsFeedsService(productId: number) {
    try {
      return await this.repository.getProductsFeeds(productId);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getProductsService(page: number) {
    try {
      return await this.repository.getProducts(page);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getVendorsProductsService(vendorName: string) {
    try {
      return await this.repository.getVendorsProducts(vendorName);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async getFoodsLengthService() {
    try {
      return await this.repository.getFoodsLength();
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getProductByIdService(id: number) {
    try {
      return await this.repository.getProductById(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async updateProductService(
    id: number,
    input: IncomingProductUpdateValidationType["body"]
  ) {
    try {
      return await this.repository.updateProduct(id, input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async deleteProductService(id: number) {
    try {
      return await this.repository.deleteProduct(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
}

export default ProductService;
