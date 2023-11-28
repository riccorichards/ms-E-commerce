import { OrderModel } from "./models/order.model";
import { VendorModel } from "./models/vendor.model";
import { ProductModel } from "./models/orderMenu.model";
import { CustomerModel } from "./models/customer.model";
import { sequelize } from "./connectToSequelize";
import { DeliveryModel } from "./models/delivery.model";
import { FeedbacksModal } from "./models/feedbacks.model";
import { SessionModel } from "./models/session.model";

const Product = ProductModel(sequelize);
const Order = OrderModel(sequelize);
const Delivery = DeliveryModel(sequelize);
const Vendor = VendorModel(sequelize);
const Customer = CustomerModel(sequelize);
const Feedbacks = FeedbacksModal(sequelize);
const Session = SessionModel(sequelize);

export default {
  Product,
  Feedbacks,
  Order,
  Delivery,
  Vendor,
  Customer,
  Session,
};
