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
  async getMainCatById(id: number) {
    try {
      return await initialize.MainCat.findByPk(id, {
        include: [
          {
            model: initialize.SubCat,
            as: "subCategories",
          },
        ],
      });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
  async updateMainCat(id: number, input: MainCatInputType) {
    try {
      const [rows] = await initialize.MainCat.update(input, { where: { id } });
      if (rows === 0) return log.error({ err: "No changes in rows" });
      return await initialize.MainCat.findByPk(id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
  async deleteMainCat(id: number) {
    try {
      return await initialize.MainCat.destroy({ where: { id } });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
}

export default MainCatRepo;
