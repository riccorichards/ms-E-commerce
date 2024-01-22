import FeedbackRepo from "../database/repository/feedback.repository";
import { FeedbackValidation } from "../database/validation/feedback.validation";

class FeedService {
  private feedRepo: FeedbackRepo;

  constructor(feedRepo: FeedbackRepo) {
    this.feedRepo = feedRepo;
  }

  async CreateFeedService(input: FeedbackValidation) {
    return await this.feedRepo.CreateFeedback(input);
  }

  async GetFeedsService(userId: string) {
    return await this.feedRepo.GetFeedbacks(userId);
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
}

export default FeedService;
