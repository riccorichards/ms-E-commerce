import { Model, Sequelize, DataTypes } from "sequelize";
import { ProductDocsType, ProductType } from "../types/types.orderMenu";

class Product
  extends Model<ProductDocsType, ProductType>
  implements ProductDocsType
{
  public id!: number;
  public title!: string;
  public image!: string;
  public price!: string;
  public unit!: number;
  public orderId!: number;
}

export const ProductModel = (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize, modelName: "products" }
  );

  return Product;
};
