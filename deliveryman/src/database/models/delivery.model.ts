import { DataTypes, Model, Sequelize } from "sequelize";
import { DeliveryDocsType, DeliveryType } from "../types/type.delivery";

class Delivery
  extends Model<DeliveryDocsType, DeliveryType>
  implements DeliveryDocsType
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public isValid!: boolean;
  public image!: string;
  public currentAddress!: string;
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
      password: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      image: { type: DataTypes.STRING, allowNull: false },
      isValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      currentAddress: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: "deliveries", timestamps: true }
  );
  return Delivery;
};
