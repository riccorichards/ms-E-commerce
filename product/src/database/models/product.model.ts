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
  public url!: string | null;
  public vendor_name!: string;
  public address!: string;
  public vendor_rating!: number;
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
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vendor_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vendor_rating: {
        type: DataTypes.DECIMAL(2, 1),
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
