import { Model, Sequelize, DataTypes } from "sequelize";
import { VendorDocsType, VendorType } from "../types/types.vendor";

class Vendor
  extends Model<VendorDocsType, VendorType>
  implements VendorDocsType
{
  public id!: number;
  public name!: string;
  public rating!: number;
  public reviewAmount!: number;
  public orderId!: number;
  public address!: string;
}

export const VendorModel = (sequelize: Sequelize) => {
  Vendor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviewAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: "vendors" }
  );

  return Vendor;
};
