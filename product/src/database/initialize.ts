import { ProductModel } from "./models/product.model";
import { MainCatModal } from "./models/mainCaterogy.model";
import { SubCatModel } from "./models/subCaterogy.model";
import { sequelize } from "./connectToSequelize";
import { FeedbacksModal } from "./models/feedback.model";

const Product = ProductModel(sequelize);
const Feedbacks = FeedbacksModal(sequelize);
const MainCat = MainCatModal(sequelize);
const SubCat = SubCatModel(sequelize);

export default {
  Product,
  Feedbacks,
  MainCat,
  SubCat,
};
