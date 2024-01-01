import log from "../../utils/logger";
import initialize from "../initialize";
import {
  FeedbackMessageType,
  UpdateFeedbackMessageType,
} from "../types/types.feedbacks";

class FeedbacksRepo {
  async createFeedback(input: FeedbackMessageType) {
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

  async updateFeedback(input: UpdateFeedbackMessageType) {
    try {
      const id = input.feedId;
      const [updatedFeeds] = await initialize.Feedbacks.update(input, {
        where: { feedId: id },
      });
      if (updatedFeeds === 0) return log.error({ err: "No changes in rows" });
      return await initialize.Feedbacks.findByPk(id);
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }

  async deleteFeedback(id: number) {
    try {
      return await initialize.Feedbacks.destroy({ where: { feedId: id } });
    } catch (error: any) {
      log.error({ err: error.message });
    }
  }
}

export default FeedbacksRepo;
