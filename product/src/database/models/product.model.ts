import { Model, DataTypes, Sequelize } from "sequelize";
import { ProductDocsType, ProductInputType } from "../types/types.product";

class Product
  extends Model<ProductDocsType, ProductInputType>
  implements ProductDocsType
{
  public id!: number;
  public title!: string;
  public desc!: string;
  public price!: string;
  public image!: string;
  public vendorAddres!: string;
  public discount!: string;
  public subCatId!: number;
  public createdAt!: Date;
}

export const ProductModel = (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vendorAddres: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subCatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Product",
      timestamps: true,
    }
  );

  return Product;
};
