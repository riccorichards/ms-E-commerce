import FeedbackRepo from "../database/repository/feedback.repository";
import { FeedbackValidation } from "../database/validation/feedback.validation";
import log from "../utils/logger";
import { Channel, Message } from "amqplib";

interface EventType {
  type: string;
  data: { updatedImage: string; updatedUsername: string };
}

class FeedService {
  private feedRepo: FeedbackRepo;

  constructor(feedRepo: FeedbackRepo) {
    this.feedRepo = feedRepo;
  }

  async CreateFeedService(input: FeedbackValidation) {
    return await this.feedRepo.CreateFeedback(input);
  }

  async CustomerFeedsService(id: string, page: number) {
    return await this.feedRepo.CustomerFeeds(id, page);
  }

  async GetFeedbacksLengthService() {
    return await this.feedRepo.GetFeedbacksLength();
  }

  async UpdateFeedService(id: number, input: FeedbackValidation) {
    return await this.feedRepo.UpdateFeedback(id, input);
  }

  async RemoveFeedService(id: number) {
    return await this.feedRepo.RemoveFeedback(id);
  }

  async SubscribeEvent(event: EventType, channel: Channel, msg: Message) {
    log.info(
      "========================== Triggering an event ======================"
    );

    try {
      switch (event.type) {
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

export default FeedService;
