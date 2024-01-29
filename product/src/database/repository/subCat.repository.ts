import { Op } from "sequelize";
import { IncomingSubCatValidationType } from "../../api/middleware/validation/subCategory.validation";
import log from "../../utils/logger";
import initialize from "../initialize";
import { SubCatInputType } from "../types/types.subCategory";

class subCatRepo {
  async createSubCut(
    input: IncomingSubCatValidationType["body"]
    //vendorId: string
  ) {
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

  async getMainCatSubCats(id: number) {
    try {
      return await initialize.SubCat.findAll({
        where: { mainCatId: id },
        include: [{ model: initialize.Product, as: "Products" }],
      });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

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

  async updateSubCat(id: number, input: SubCatInputType) {
    try {
      const [updatedFeeds] = await initialize.SubCat.update(input, {
        where: { id },
      });
      if (updatedFeeds === 0) return log.error({ err: "No changes in rows" });
      return await initialize.SubCat.findByPk(id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async deleteSubCat(id: number) {
    try {
      return await initialize.SubCat.destroy({ where: { id } });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
}

export default subCatRepo;
