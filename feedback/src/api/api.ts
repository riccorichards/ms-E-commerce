import { Application, Request, Response } from "express";
import log from "../utils/logger";
import { verifyJWT } from "./verifyToken";
import FeedService from "../services/feed.service";
import Feedback from "../database/repository/initialiaze.repo";
import FeedbackRepo from "../database/repository/feedback.repository";
import { CreateChannel, PublishMessage } from "../utils/rabbitMQ.utils";
import config from "../../config";
import getFeedbackEventType from "../utils/eventGenerator";
import { validateIncomingData } from "../utils/errorHandler";
type FeedbackToType = "vendor" | "product" | "deliveryman";

const api = async (app: Application) => {
  const feedbackRepo = new FeedbackRepo(Feedback);
  const feedService = new FeedService(feedbackRepo);

  const channel = await CreateChannel();

  app.use(verifyJWT);

  //creating feedbacks
  app.post(
    "/feedback",
    validateIncomingData, // middleware
    async (req: Request, res: Response) => {
      try {
        const newFeedback = await feedService.CreateFeedService(req.body);
        if (!newFeedback)
          return res
            .status(404)
            .json({ msg: "Error whilee creating a new feedback" });
        //we extrating id because of avoid conflic to other servers
        const { id, ...other } = newFeedback;
        //create an event for customer
        const Customer_event = {
          type: "add_feedback",
          data: { ...other, feedId: id },
        };

        //define the direction based on provided address and the method
        const targetType = getFeedbackEventType(newFeedback.address, "add");

        if (!targetType) {
          log.error("Unhandled event type" + targetType);
          return null;
        }

        //creat an event for target (vendor, product or deliveryman)
        const event = {
          type: targetType,
          data: { ...other, feedId: id },
        };

        // grab all binding
        const bindings = {
          vendor: config.vendor_binding_key,
          product: config.product_binding_key,
          deliveryman: config.deliveryman_binding_key,
        };
        // based on address we easily can define which one of the bindings we need
        const bindingsKey = bindings[newFeedback.address as FeedbackToType]
          ? bindings[newFeedback.address as FeedbackToType]
          : null;

        if (channel) {
          PublishMessage(
            channel,
            config.customer_binding_key,
            JSON.stringify(Customer_event)
          );

          if (bindingsKey) {
            PublishMessage(channel, bindingsKey, JSON.stringify(event));
          }
        }
        return res.status(201).json(newFeedback);
      } catch (error: any) {
        log.error(error.message);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
    }
  );

  // it reruns only admin panel to define how many feedback the application has
  app.get(
    "/feedbacks-length",
    async (req: Request<{ id: string }>, res: Response) => {
      try {
        const feeback = await feedService.GetFeedbacksLengthService();
        if (!feeback)
          return res.status(404).json({ msg: "Error while fetching feedback" });
        return res.status(201).json(feeback);
      } catch (error: any) {
        log.error(error.message);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
    }
  );

  //for update purpose, but we do not use yet.
  app.put("/feedback/:id", async (req: Request, res: Response) => {
    try {
      const feedId = parseInt(req.params.id);

      const updatedFeedback = await feedService.UpdateFeedService(
        feedId,
        req.body
      );

      if (!updatedFeedback)
        return res
          .status(404)
          .json({ msg: "Error whilee updating a feedback" });

      const { id, ...other } = updatedFeedback;

      const Customer_event = {
        type: "add_feedback",
        data: { ...other, feedId: id },
      };

      const targetType = getFeedbackEventType(
        updatedFeedback.address,
        "update"
      );

      if (!targetType) {
        log.error("Unhandled event type" + targetType);
        return null;
      }

      const event = {
        type: targetType,
        data: { ...other, feedId: id },
      };

      const bindings = {
        vendor: config.vendor_binding_key,
        product: config.product_binding_key,
        deliveryman: config.deliveryman_binding_key,
      };

      const bindingsKey = bindings[updatedFeedback.address as FeedbackToType]
        ? bindings[updatedFeedback.address as FeedbackToType]
        : null;

      if (channel) {
        PublishMessage(
          channel,
          config.customer_binding_key,
          JSON.stringify(Customer_event)
        );

        if (bindingsKey) {
          PublishMessage(channel, bindingsKey, JSON.stringify(event));
        }
      }
      return res.status(201).json(updatedFeedback);
    } catch (error: any) {
      log.error(error.message);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  });

  // remove feedback, once the feedback server removes the feedback, it needs to send removed feedback's Id via RabbitMQ to update other servers
  app.delete(
    "/feedback/:id",
    async (req: Request<{ id: string }>, res: Response) => {
      try {
        const id = parseInt(req.params.id);
        const feedback = await feedService.RemoveFeedService(id);
        if (!feedback)
          return res
            .status(404)
            .json({ msg: "Error while removing a feedback" });

        const Customer_event = {
          type: "add_feedback",
          data: { ...feedback, feedId: feedback.id },
        };

        const targetType = getFeedbackEventType(feedback.address, "delete");

        if (!targetType) {
          log.error("Unhandled event type" + targetType);
          return null;
        }

        const event = {
          type: targetType,
          data: { feedId: feedback.id },
        };

        const bindings = {
          vendor: config.vendor_binding_key,
          product: config.product_binding_key,
          deliveryman: config.deliveryman_binding_key,
        };

        const bindingsKey = bindings[feedback.address as FeedbackToType]
          ? bindings[feedback.address as FeedbackToType]
          : null;

        if (channel) {
          PublishMessage(
            channel,
            config.customer_binding_key,
            JSON.stringify(Customer_event)
          );

          if (bindingsKey) {
            PublishMessage(channel, bindingsKey, JSON.stringify(event));
          }
        }
        return res.status(201).json(feedback);
      } catch (error: any) {
        log.error(error.message);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
    }
  );
};

export default api;
