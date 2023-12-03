import initialize from "./initialize";

export const setupAssociation = () => {
  const Products = initialize.Product;
  const Feedbacks = initialize.Feedbacks;
  const Customer = initialize.Customer;
  const Order = initialize.Order;
  const Delivery = initialize.Delivery;
  const Vendor = initialize.Vendor;

  //------------------------------delivery associations
  Delivery.hasMany(Order, { foreignKey: "deliveryId", as: "orders" });

  Delivery.hasMany(Feedbacks, { foreignKey: "targetId", as: "feedbacks" });

  //couple of models are belong to the delivery
  Order.belongsTo(Delivery, { foreignKey: "deliveryId" });

  Feedbacks.belongsTo(Delivery, { foreignKey: "targetId" });

  //-------------------------order associations
  Order.hasOne(Customer, { foreignKey: "orderId", as: "customer" });

  Order.hasOne(Vendor, { foreignKey: "orderId", as: "vendor" });

  Order.hasMany(Products, { foreignKey: "orderId", as: "menu" });

  //couple of models are belong to the order

  Customer.belongsTo(Order, { foreignKey: "orderId" });

  Vendor.belongsTo(Order, { foreignKey: "orderId" });

  Products.belongsTo(Order, { foreignKey: "orderId" });
};
