import log from "../../utils/logger";
import initialize from "../initialize";
import { FeedbacksInputType } from "../types/types.feedbacks";

class FeedbacksRepo {
  async createFeedback(input: FeedbacksInputType) {
    try {
      return await initialize.Feedbacks.create(input);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
  async getFeedbacks() {
    try {
      return await initialize.Feedbacks.findAll();
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
  async getFeedbackById(id: number) {
    try {
      return await initialize.Feedbacks.findByPk(id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
  async updateFeedback(id: number, input: FeedbacksInputType) {
    try {
      const [updatedFeeds] = await initialize.Feedbacks.update(input, {
        where: { id },
      });
      if (updatedFeeds === 0) return log.error({ err: "No changes in rows" });
      return await initialize.Feedbacks.findByPk(id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
  async deleteFeedback(id: number) {
    try {
      return await initialize.Feedbacks.destroy({ where: { id } });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
}

export default FeedbacksRepo;
