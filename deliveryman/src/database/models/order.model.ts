import { Model, DataTypes, Sequelize } from "sequelize";
import { OrderDocsType, OrderType } from "../types/types.order";

class Order extends Model<OrderDocsType, OrderType> implements OrderDocsType {
  public id!: number;
  public username!: string;
  public customerEmail!: string;
  public customerAddress!: string;
  public vedor!: string;
  public vendorEmail!: string;
  public vendorAddress!: string;
  public vendorRating!: string;
  public customerImg?: string;
  public orderStatus!: string;
  public note?: string;
  public deliveryTime!: string;
  public distance!: string;
  public paymentMethod!: string;
  public totalAmount!: string;
  public deliverymanId!: number;
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
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vedor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vendorAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vendorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vendorRating: {
        type: DataTypes.STRING,
        allowNull: false,
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
      totalAmount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deliverymanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "orders",
    }
  );

  return Order;
};
