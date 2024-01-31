import { Op } from "sequelize";
import { IncomingSubCatValidationType } from "../../api/middleware/validation/subCategory.validation";
import log from "../../utils/logger";
import initialize from "../initialize";
import { SubCatInputType } from "../types/types.subCategory";

class subCatRepo {
  async createSubCut(input: IncomingSubCatValidationType["body"]) {
    try {
      return await initialize.SubCat.create(input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async getSubCats() {
    try {
      return await initialize.SubCat.findAll({
        include: [{ model: initialize.Product, as: "Products" }],
      });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async getVendorsSubCats(vendorId: string) {
    try {
      return await initialize.SubCat.findAll({ where: { vendorId: vendorId } });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async getSubCatById(id: number) {
    try {
      return await initialize.SubCat.findByPk(id, {
        include: [{ model: initialize.Product, as: "Products" }],
      });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  //returns main cat's sub categories
  async getMainCatSubCats(id: number) {
    try {
      //the selected sub cats need it own associated food
      return await initialize.SubCat.findAll({
        where: { mainCatId: id },
        include: [{ model: initialize.Product, as: "Products" }],
      });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  //not used yet.
  async searchFoodInSubCat(title: string, id: number) {
    try {
      const result = await initialize.SubCat.findByPk(id, {
        include: [
          {
            model: initialize.Product,
            as: "Products",
            where: { title: { [Op.like]: `%${title}%` } },
          },
        ],
      });

      if (!result) return "Not found any matches";
      return result;
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
}

export default subCatRepo;
