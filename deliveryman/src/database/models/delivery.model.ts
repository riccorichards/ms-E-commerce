import { DataTypes, Model, Sequelize } from "sequelize";
import { DeliveryDocsType, DeliveryType } from "../types/type.delivery";

class Delivery
  extends Model<DeliveryDocsType, DeliveryType>
  implements DeliveryDocsType
{
  public id!: number;
  public name!: string;
  public rating!: number;
  public email!: string;
  public password!: string;
  public orderAmount!: number;
  public image!: string;
  public reviewAmount!: number;
  public totalEarn!: string;
  public lat!: number;
  public lng!: number;
}

export const DeliveryModel = (sequelize: Sequelize) => {
  Delivery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      orderAmount: { type: DataTypes.INTEGER, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: false },
      reviewAmount: { type: DataTypes.INTEGER, allowNull: false },
      totalEarn: { type: DataTypes.STRING, allowNull: false },
      lat: { type: DataTypes.FLOAT, allowNull: false },
      lng: { type: DataTypes.FLOAT, allowNull: false },
    },
    { sequelize, modelName: "deliveries", timestamps: true }
  );
  return Delivery;
};
