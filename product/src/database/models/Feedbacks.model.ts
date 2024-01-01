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
  public authorImg?: string;
  public address!: string;
  public targetId!: number;
  public targetImg!: string;
  public targetTitle!: string;
  public feedId!: number;
  public review!: string;
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
      authorImg: { type: DataTypes.TEXT, allowNull: true },
      targetId: { type: DataTypes.INTEGER, allowNull: false },
      targetImg: { type: DataTypes.STRING, allowNull: false },
      targetTitle: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      feedId: { type: DataTypes.INTEGER, allowNull: false },
      review: { type: DataTypes.STRING, allowNull: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, modelName: "Feedbacks", timestamps: true }
  );
  return Feedbacks;
};
