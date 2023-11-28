import { DataTypes, Model, Sequelize } from "sequelize";
import { SessionDocsType, SessionType } from "./../types/type.session";

class Session
  extends Model<SessionDocsType, SessionType>
  implements SessionType
{
  public id!: number;
  public delivery!: string;
  public userAgent!: string;
}

export const SessionModel = (sequelize: Sequelize) => {
  Session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      delivery: { type: DataTypes.STRING, allowNull: false },
      userAgent: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: "sessions" }
  );

  return Session;
};
