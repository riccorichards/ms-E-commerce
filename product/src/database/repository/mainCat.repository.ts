import { IncomingMainCatValidationType } from "../../api/middleware/validation/mainCategory.validation";
import log from "../../utils/logger";
import initialize from "../initialize";
import { MainCatInputType } from "../types/types.mainCategory";

class MainCatRepo {
  // main category
  async createMainCut(input: IncomingMainCatValidationType["body"]) {
    try {
      return await initialize.MainCat.create(input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
  async getMainCats() {
    try {
      return await initialize.MainCat.findAll();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
}

export default MainCatRepo;
