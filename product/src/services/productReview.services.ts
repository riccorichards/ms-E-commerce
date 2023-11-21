import FeedbacksRepo from "../database/repository/feedbacks.repository";
import { FeedbacksInputType } from "../database/types/types.feedbacks";
import log from "../utils/logger";

class FeedbacksService {
  private repository: FeedbacksRepo;

  constructor() {
    this.repository = new FeedbacksRepo();
  }

  async createFeedbacksService(input: FeedbacksInputType) {
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
  async getFeedbacksByIdService(id: number) {
    try {
      return await this.repository.getFeedbackById(id);
    } catch (error: any) {
      log.error({
        err: error.message,
      });
    }
  }
  async updateFeedbacksService(id: number, input: FeedbacksInputType) {
    try {
      return await this.repository.updateFeedback(id, input);
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
}

export default FeedbacksService;
