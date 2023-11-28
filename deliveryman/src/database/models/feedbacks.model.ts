import { DataTypes, Model, Sequelize } from "sequelize";
import {
  FeedbacksDocsType,
  FeedbacksInputType,
} from "../types/types.feedbacks";

class feedbacks
  extends Model<FeedbacksDocsType, FeedbacksInputType>
  implements FeedbacksDocsType
{
  public id!: number;
  public author!: string;
  public deliveryId!: number;
  public profileImg!: string;
  public review!: string;
  public rating!: number;
}

export const FeedbacksModal = (sequelize: Sequelize) => {
  feedbacks.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      author: { type: DataTypes.STRING, allowNull: false },
      profileImg: { type: DataTypes.STRING, allowNull: true },
      deliveryId: { type: DataTypes.INTEGER, allowNull: false },
      review: { type: DataTypes.STRING, allowNull: true },
      rating: { type: DataTypes.INTEGER, allowNull: true },
    },
    { sequelize, modelName: "feedbacks", timestamps: true }
  );
  return feedbacks;
};
