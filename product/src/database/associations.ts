import initialize from "./initialize";

export const setupAssociation = () => {
  const Main_Cat = initialize.MainCat;
  const Sub_Cat = initialize.SubCat;
  const Products = initialize.Product;
  const Feedbacks = initialize.Feedbacks;

  Main_Cat.hasMany(Sub_Cat, { foreignKey: "mainCatId", as: "subCategories" });

  Sub_Cat.belongsTo(Main_Cat, { foreignKey: "mainCatId" });

  Sub_Cat.hasMany(Products, { foreignKey: "subCatId", as: "Products" });

  Products.belongsTo(Sub_Cat, { foreignKey: "subCatId" });

  Products.hasMany(Feedbacks, { foreignKey: "targetId", as: "feedbacks" });

  Feedbacks.belongsTo(Products, { foreignKey: "targetId" });
};
