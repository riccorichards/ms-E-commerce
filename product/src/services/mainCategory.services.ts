import MainCatRepo from "../database/repository/mainCat.repository";
import { MainCatInputType } from "../database/types/types.mainCategory";
import log from "../utils/logger";

class MainCatService {
  private repository: MainCatRepo;

  constructor() {
    this.repository = new MainCatRepo();
  }

  async createMainCatService(input: MainCatInputType) {
    try {
      return await this.repository.createMainCut(input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getMainCatsService() {
    try {
      return await this.repository.getMainCats();
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async getMainCatByIdService(id: number) {
    try {
      return await this.repository.getMainCatById(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async updateMainCatService(id: number, input: MainCatInputType) {
    try {
      return await this.repository.updateMainCat(id, input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async deleteMainCatService(id: number) {
    try {
      return await this.repository.deleteMainCat(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
}

export default MainCatService;
