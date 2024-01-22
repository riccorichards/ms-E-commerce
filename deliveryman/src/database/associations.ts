import initialize from "./initialize";

export const setupAssociation = () => {
  const Feedbacks = initialize.Feedbacks;
  const Delivery = initialize.Delivery;

  //------------------------------delivery associations
  Delivery.hasMany(Feedbacks, { foreignKey: "targetId", as: "feedbacks" });

  //couple of models are belong to the delivery
  Feedbacks.belongsTo(Delivery, { foreignKey: "targetId" });
};
