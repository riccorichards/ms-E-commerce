import initialize from "./initialize";

export const setupAssociation = () => {
  const Products = initialize.Product;
  const Feedbacks = initialize.Feedbacks;
  const Order = initialize.Order;
  const Delivery = initialize.Delivery;

  //------------------------------delivery associations
  Delivery.hasMany(Order, { foreignKey: "deliverymanId", as: "orders" });

  Delivery.hasMany(Feedbacks, { foreignKey: "targetId", as: "feedbacks" });

  //couple of models are belong to the delivery
  Order.belongsTo(Delivery, { foreignKey: "deliverymanId" });

  Feedbacks.belongsTo(Delivery, { foreignKey: "targetId" });

  //-------------------------order associations

  Order.hasMany(Products, { foreignKey: "orderId", as: "menu" });

  //couple of models are belong to the order

  Products.belongsTo(Order, { foreignKey: "orderId" });
};
