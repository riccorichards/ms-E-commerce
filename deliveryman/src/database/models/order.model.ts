import { Model, DataTypes, Sequelize } from "sequelize";
import { OrderDocsType, OrderType } from "../types/types.order";

class Order extends Model<OrderDocsType, OrderType> implements OrderDocsType {
  public id!: number;
  public deliveryTime!: string;
  public distance!: string;
  public paymentMethod!: string;
  public totalAmount!: string;
  public confirmationStatus!: boolean;
  public deliveryId!: number;
}

export const OrderModel = (sequelize: Sequelize) => {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      deliveryTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      distance: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deliveryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      confirmationStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "orders",
    }
  );

  return Order;
};
