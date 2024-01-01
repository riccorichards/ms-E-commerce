import { Channel, Message } from "amqplib";
import DeliveryRepo from "../database/repository/delivery.repository";
import { DeliveryType } from "../database/types/type.delivery";
import { LoginStyle } from "../database/types/type.session";
import { CustomerType } from "../database/types/types.customer";
import { FeedbackMessageType } from "../database/types/types.feedbacks";
import { OrderType } from "../database/types/types.order";
import { ProductType } from "../database/types/types.orderMenu";
import { VendorType } from "../database/types/types.vendor";
import { EventType } from "../database/types/type.event";
import log from "../utils/logger";
import { IncomingDeliveryDataType } from "../api/middleware/validation/deliveryman.validation";
import { IncomingOrderDataType } from "../api/middleware/validation/orders.validation";

class DeliveryService {
  private repository: DeliveryRepo;

  constructor() {
    this.repository = new DeliveryRepo();
  }

  async CreateDeliveryService(input: IncomingDeliveryDataType["body"]) {
    return await this.repository.CreateDeliveryMan(input);
  }

  async CreateSessionService(
    { email, password }: LoginStyle,
    userAgent: string
  ) {
    return this.repository.CreateSession({ email, password }, userAgent);
  }

  async UpdateDeliverymanService(id: number, input: DeliveryType) {
    return this.repository.UpdateDeliveryman(id, input);
  }

  async CreateOrderService(input: IncomingOrderDataType["body"]) {
    return this.repository.CreateOrder(input);
  }

  async GetAllValidDeliverymanService() {
    return this.repository.GetAllDeliverymen();
  }

  async AddOrderMenuService(input: ProductType[]) {
    return this.repository.AddOrderMenu(input);
  }

  async CreateFeedbackService(input: FeedbackMessageType) {
    return this.repository.createFeedback(input);
  }
  
  async UpdateFeedbackService(input: FeedbackMessageType) {
    return this.repository.updateFeedback(input);
  }
  async DeleteFeedbackService(id: number) {
    return this.repository.removeFeedback(id);
  }

  async GetDeliverymanService(id: number) {
    return this.repository.GetDeliveryman(id);
  }

  async GetDeliverymanWithSpecFieldService(id: number, field: string) {
    return this.repository.GetDeliverymanWithSpecField(id, field);
  }

  async SubscribeEvent(event: EventType, channel: Channel, msg: Message) {
    log.info(
      "========================== Triggering an event ======================"
    );

    try {
      switch (event.type) {
        case "add_feed_in_deliveryman":
          this.CreateFeedbackService(event.data);
          break;
        case "update_feed_in_deliveryman":
          this.UpdateFeedbackService(event.data);
          break;
        case "remove_feed_from_deliveryman":
          this.DeleteFeedbackService(event.data.feedId);
          break;
        default:
          log.info(`Unhandled event type: ${event.type}`);
      }
      channel.ack(msg);
    } catch (error: any) {
      log.error(`Error processing event: ${error.message}`);
      channel.nack(msg);
    }
  }
}

export default DeliveryService;
