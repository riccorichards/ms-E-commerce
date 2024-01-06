import { Channel, Message } from "amqplib";
import FeedbacksRepo from "../database/repository/feedbacks.repository";
import {
  FeedbackMessageType,
  UpdateFeedbackMessageType,
} from "../database/types/types.feedbacks";
import log from "../utils/logger";
import { EventType } from "../database/types/type.event";

class FeedbacksService {
  private repository: FeedbacksRepo;

  constructor() {
    this.repository = new FeedbacksRepo();
  }

  async createFeedbacksService(input: FeedbackMessageType) {
    try {
      return await this.repository.createFeedback(input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async getFeedbackssService() {
    try {
      return await this.repository.getFeedbacks();
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async updateFeedbacksService(input: UpdateFeedbackMessageType) {
    try {
      return await this.repository.updateFeedback(input);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async deleteFeedbacksService(id: number) {
    try {
      return await this.repository.deleteFeedback(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }

  async SubscribeEvent(event: EventType, channel: Channel, msg: Message) {
    log.info(
      "========================== Triggering an event ======================"
    );
    try {
      switch (event.type) {
        case "add_feed_in_product":
          this.createFeedbacksService(event.data);
          break;
        case "update_feed_in_product":
          this.updateFeedbacksService(event.data);
          break;
        case "remove_feed_from_product":
          this.deleteFeedbacksService(event.data.feedId);
          break;
        default:
          log.info(`Unhandled event type: ${event.type}`);
      }
      channel.ack(msg);
    } catch (error: any) {
      log.info(`Error while Subscribe events: ${error.messge}`);
      channel.nack(msg);
    }
  }
}

export default FeedbacksService;
