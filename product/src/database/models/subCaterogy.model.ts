import { Model, Sequelize, DataTypes } from "sequelize";
import { SubCatDocsType, SubCatInputType } from "../types/types.subCategory";

class SubCat
  extends Model<SubCatDocsType, SubCatInputType>
  implements SubCatDocsType
{
  public id!: number;
  public title!: string;
  public desc!: string;
  public vendorId!: string;
  public mainCatId!: number;
  public createdAt!: Date;
}

export const SubCatModel = (sequelize: Sequelize) => {
  SubCat.init(
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
      desc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vendorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mainCatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize, timestamps: true, modelName: "SubCat" }
  );

  return SubCat;
};
