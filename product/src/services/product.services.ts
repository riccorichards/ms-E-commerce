import ProductRepo from "../database/repository/product.repository";
import { ProductDocsType, ProductInputType } from "../database/types/types.product";
import log from "../utils/logger";

class ProductService {
  private repository: ProductRepo;

  constructor() {
    this.repository = new ProductRepo();
  }

  async createProductService(input: ProductInputType) {
    try {
      return await this.repository.createProduct(input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async getProductsService() {
    try {
      return await this.repository.getProducts();
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
  async updateProductService(id: number, input: ProductDocsType) {
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
