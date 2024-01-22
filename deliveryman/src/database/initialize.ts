import { sequelize } from "./connectToSequelize";
import { DeliveryModel } from "./models/delivery.model";
import { FeedbacksModal } from "./models/feedbacks.model";
import { SessionModel } from "./models/session.model";

const Delivery = DeliveryModel(sequelize);
const Feedbacks = FeedbacksModal(sequelize);
const Session = SessionModel(sequelize);

export default {
  Feedbacks,
  Delivery,
  Session,
};
