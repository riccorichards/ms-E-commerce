import subCatRepo from "../database/repository/subCat.repository";
import { SubCatInputType } from "../database/types/types.subCategory";
import log from "../utils/logger";

class SubCatService {
  private repository: subCatRepo;

  constructor() {
    this.repository = new subCatRepo();
  }

  async createSubCatService(input: SubCatInputType) {
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
  async getSubCatByIdService(id: number) {
    try {
      return await this.repository.getSubCatById(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async updateSubCatService(id: number, input: SubCatInputType) {
    try {
      return await this.repository.updateSubCat(id, input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async deleteSubCatService(id: number) {
    try {
      return await this.repository.deleteSubCat(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
}

export default SubCatService;
