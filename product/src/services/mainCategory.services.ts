import { IncomingMainCatValidationType } from "../api/middleware/validation/mainCategory.validation";
import MainCatRepo from "../database/repository/mainCat.repository";
import { MainCatInputType } from "../database/types/types.mainCategory";
import log from "../utils/logger";

class MainCatService {
  private repository: MainCatRepo;

  constructor() {
    this.repository = new MainCatRepo();
  }

  async createMainCatService(input: IncomingMainCatValidationType["body"]) {
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
}

export default MainCatService;
