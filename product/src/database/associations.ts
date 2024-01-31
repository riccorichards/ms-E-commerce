import initialize from "./initialize";

export const setupAssociation = () => {
  const Main_Cat = initialize.MainCat;
  const Sub_Cat = initialize.SubCat;
  const Products = initialize.Product;
  const Feedbacks = initialize.Feedbacks;

  //main cats has many sub categories
  Main_Cat.hasMany(Sub_Cat, { foreignKey: "mainCatId", as: "subCategories" });

  //sub cats belongs to main category
  Sub_Cat.belongsTo(Main_Cat, { foreignKey: "mainCatId" });

  //sub category has many products
  Sub_Cat.hasMany(Products, { foreignKey: "subCatId", as: "Products" });

  //products belong sub categories
  Products.belongsTo(Sub_Cat, { foreignKey: "subCatId" });

  //products has many feedbacks
  Products.hasMany(Feedbacks, { foreignKey: "targetId", as: "feedbacks" });

  //feedback belongs to products
  Feedbacks.belongsTo(Products, { foreignKey: "targetId" });
};
