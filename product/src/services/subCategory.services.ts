import { IncomingSubCatValidationType } from "../api/middleware/validation/subCategory.validation";
import subCatRepo from "../database/repository/subCat.repository";
import { SubCatInputType } from "../database/types/types.subCategory";
import log from "../utils/logger";

class SubCatService {
  private repository: subCatRepo;

  constructor() {
    this.repository = new subCatRepo();
  }

  async createSubCatService(input: IncomingSubCatValidationType["body"]) {
    try {
      return await this.repository.createSubCut(input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async getSubCatsService() {
    try {
      return await this.repository.getSubCats();
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getVendorSubCatsService(vendorId: string) {
    try {
      return await this.repository.getVendorsSubCats(vendorId);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getSubCatByIdService(id: number) {
    try {
      return await this.repository.getSubCatById(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async searchFoodInSubCatService(id: number, title: string) {
    try {
      return await this.repository.searchFoodInSubCat(title, id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getMainCatSubCatsService(id: number) {
    try {
      return await this.repository.getMainCatSubCats(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
}

export default SubCatService;
