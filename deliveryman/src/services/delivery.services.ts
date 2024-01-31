import { Channel, Message } from "amqplib";
import DeliveryRepo from "../database/repository/delivery.repository";
import { DeliveryType } from "../database/types/type.delivery";
import { LoginStyle } from "../database/types/type.session";
import {
  FeedbackMessageType,
  UpdateCustomerInfoInFeedMessageType,
} from "../database/types/types.feedbacks";
import { EditImageMessage, EventType } from "../database/types/type.event";
import log from "../utils/logger";
import { IncomingDeliveryDataType } from "../api/middleware/validation/deliveryman.validation";

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

  async GetAllValidDeliverymanService() {
    return this.repository.GetAllDeliverymen();
  }

  async CreateFeedbackService(input: FeedbackMessageType) {
    return this.repository.createFeedback(input);
  }

  async EditImageSerivce(input: EditImageMessage) {
    return this.repository.editImage(input);
  }
  async GetDeliveryFeedsService(
    id: number,
    amount: number | undefined | string
  ) {
    return this.repository.getDeliveryFeeds(id, amount);
  }

  async GetDeliveryActivitiesService(
    id: number,
    isStats: boolean,
    amount: number | undefined | string
  ) {
    return this.repository.GetDeliveryActivities(id, isStats, amount);
  }

  async DeleteFeedbackService(id: number) {
    return this.repository.removeFeedback(id);
  }

  async GetDeliverymanByNameService(name: string, isCoords: boolean) {
    return this.repository.GetDeliverymanByName(name, isCoords);
  }

  async GetAlDeliverymanService(page: number) {
    return this.repository.GetAllDeliveryman(page);
  }

  async GetDelirymanForOrderService(id: number) {
    return this.repository.GetDeliverymanForOrder(id);
  }

  async GetDeliverymanService(id: number) {
    return this.repository.GetDeliveryman(id);
  }

  async SubscribeEvent(event: EventType, channel: Channel, msg: Message) {
    log.info(
      "========================== Triggering an event ======================"
    );

    try {
      switch (event.type) {
        case "add_feed_in_deliveryman":
          this.CreateFeedbackService(event.data as FeedbackMessageType);
          break;
        case "remove_feed_from_deliveryman":
          const feed = event.data as FeedbackMessageType;
          this.DeleteFeedbackService(feed.feedId);
          break;
        case "upload_deliveryman_profile":
          this.EditImageSerivce(event.data as EditImageMessage);
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
