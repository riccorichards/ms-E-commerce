import { DataTypes, Model, Sequelize } from "sequelize";
import {
  FeedbacksDocsType,
  FeedbacksInputType,
} from "../types/types.feedbacks";

class Feedbacks
  extends Model<FeedbacksDocsType, FeedbacksInputType>
  implements FeedbacksDocsType
{
  public id!: number;
  public author!: string;
  public profileImg?: string;
  public productId!: number;
  public review!: string;
  public rating!: number;
  public createdAt?: Date;
}

export const FeedbacksModal = (sequelize: Sequelize) => {
  Feedbacks.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      author: { type: DataTypes.STRING, allowNull: false },
      profileImg: { type: DataTypes.STRING, allowNull: true },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      review: { type: DataTypes.STRING, allowNull: true },
      rating: { type: DataTypes.INTEGER, allowNull: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, modelName: "Feedbacks", timestamps: true }
  );
  return Feedbacks;
};
