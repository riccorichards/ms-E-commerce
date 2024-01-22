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
  public userId!: string;
  public author!: string;
  public authorImg!: string;
  public address!: "product" | "vendor" | "deliveryman";
  public targetId!: number;
  public targetTitle!: string;
  public targetImg!: string;
  public forVendorId?: string;
  public vendor_rating?: number;
  public review!: string;
  public feedId!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
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
      userId: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      authorImg: { type: DataTypes.TEXT, allowNull: true },
      targetId: { type: DataTypes.INTEGER, allowNull: false },
      targetImg: { type: DataTypes.TEXT, allowNull: false },
      targetTitle: { type: DataTypes.STRING, allowNull: false },
      feedId: { type: DataTypes.INTEGER, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      review: { type: DataTypes.STRING, allowNull: false },
      forVendorId: { type: DataTypes.STRING, allowNull: true },
      vendor_rating: { type: DataTypes.FLOAT, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: true },
      updatedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "Feedbacks", timestamps: true }
  );
  return Feedbacks;
};
