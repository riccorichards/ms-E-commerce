import { DataTypes, Model, Sequelize } from "sequelize";
import {
  FeedbackMessageType,
  FeedbacksDocsType,
} from "../types/types.feedbacks";

class Feedbacks
  extends Model<FeedbacksDocsType, FeedbackMessageType>
  implements FeedbacksDocsType
{
  public id!: number;
  public author!: string;
  public profileImg?: string;
  public to!: string;
  public targetId!: number;
  public feedId!: number;
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
      targetId: { type: DataTypes.INTEGER, allowNull: false },
      to: { type: DataTypes.STRING, allowNull: false },
      feedId: { type: DataTypes.INTEGER, allowNull: false },
      review: { type: DataTypes.STRING, allowNull: true },
      rating: { type: DataTypes.INTEGER, allowNull: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, modelName: "Feedbacks", timestamps: true }
  );
  return Feedbacks;
};
