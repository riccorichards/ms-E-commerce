import { Repository } from "typeorm";
import Feedbacks from "../entities/feedback.entity";
import log from "../../utils/logger";
import { FeedbackValidation } from "../validation/feedback.validation";
import { takeUrl } from "../../utils/makeRequestWithRetries";

class FeedbackRepo {
  constructor(private repository: Repository<Feedbacks>) {}

  async CreateFeedback(input: FeedbackValidation) {
    try {
      const newFeed = this.repository.create(input);
      await this.repository.save(newFeed);

      if (!newFeed)
        throw new Error("Error while creating a new feed (in repo)");

      return newFeed;
    } catch (error: any) {
      log.error(error);
    }
  }

  async CustomerFeeds(customerId: string, page: number) {
    try {
      const take = 5;
      const skip = (page - 1) * take;

      const [feedbacks, feedbackCount] = await this.repository.findAndCount({
        where: { userId: customerId },
        take,
        skip,
      });

      if (!feedbacks) throw new Error("Error while fetching feeds (in repo)");
      const totalPages = Math.ceil(feedbackCount / take);
      const pagination = {
        page,
        totalPages,
        pageSize: take,
        totalCount: feedbackCount,
      };

      const feedResult = await Promise.all(
        feedbacks.map(async (feed) => {
          const targetImage = await takeUrl(feed.targetImg);
          if (!targetImage)
            throw new Error("Error while taken the target image");

          const authorImage = await takeUrl(feed.authorImg);
          if (!authorImage)
            throw new Error("Error while taken the author image");

          feed.authorImg = authorImage;
          feed.targetImg = targetImage;

          return feed;
        })
      ).then((res) => res.sort((a, b) => b.id - a.id));
      return { feedResult, pagination };
    } catch (error: any) {
      log.error(error);
    }
  }

  async GetFeedbacksLength() {
    try {
      const feedbacks = (await this.repository.find()).length;
      if (!feedbacks) throw new Error("Error while fetching feeds (in repo)");
      return feedbacks;
    } catch (error: any) {
      log.error(error);
    }
  }

  async UpdateFeedback(id: number, input: FeedbackValidation) {
    try {
      const feedback = this.repository.findOneBy({ id });

      if (!feedback) {
        throw new Error("Feedback not found");
      }

      await this.repository.update(id, input);

      const updatedFeedback = await this.repository.findOneBy({ id });

      if (!updatedFeedback)
        throw new Error("Error while updating feed (in repo)");
      return updatedFeedback;
    } catch (error: any) {
      log.error(error);
      throw error;
    }
  }

  async RemoveFeedback(id: number) {
    try {
      const feedback = this.repository.findOneBy({ id });

      if (!feedback) {
        throw new Error("Feedback not found");
      }

      await this.repository.delete(id);

      return feedback;
    } catch (error: any) {
      log.error(error);
      throw error;
    }
  }
}

export default FeedbackRepo;
