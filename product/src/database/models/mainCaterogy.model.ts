import { DataTypes, Model, Sequelize } from "sequelize";
import { MainCatDocsType, MainCatInputType } from "../types/types.mainCategory";

class MainCat
  extends Model<MainCatDocsType, MainCatInputType>
  implements MainCatDocsType
{
  public id!: number;
  public title!: string;
  public desc!: string;
  public image!: string;
  public createdAt?: Date;
}

export const MainCatModal = (sequelize: Sequelize) => {
  MainCat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: { type: DataTypes.STRING, allowNull: false, unique: true },
      desc: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, modelName: "MainCat", timestamps: true }
  );
  return MainCat;
};
