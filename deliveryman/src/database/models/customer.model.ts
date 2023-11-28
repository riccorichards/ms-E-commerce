import { Model, Sequelize, DataTypes } from "sequelize";
import { CustomerDocsType, CustomerType } from "../types/types.customer";

class Customer
  extends Model<CustomerDocsType, CustomerType>
  implements CustomerDocsType
{
  public id!: number;
  public name!: string;
  public image!: string;
  public orderId!: number;
}

export const CustomerModel = (sequelize: Sequelize) => {
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize, modelName: "customers" }
  );

  return Customer;
};
