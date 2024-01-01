import amqplib, { Channel, Connection } from "amqplib";
import config from "../../config/index";
import log from "./logger";
import FeedbacksService from "../services/feedback.services";

// create a channel
export const CreateChannel = async (): Promise<Channel | undefined> => {
  try {
    if (config.message_broker_url) {
      const connection: Connection = await amqplib.connect(
        config.message_broker_url
      );
      const channel: Channel = await connection.createChannel();
      await channel.assertExchange(config.exchange_name, "direct", {
        durable: true,
      });
      if (!channel) throw new Error("Error while creating a new channel");
      return channel;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const SubscriberMessage = async (
  channel: Channel,
  queueName: string,
  binding_key: string
) => {
  const service = new FeedbacksService();
  const productQueue = await channel.assertQueue(queueName, { durable: true });
  channel.bindQueue(productQueue.queue, config.exchange_name, binding_key);
  channel.consume(productQueue.queue, async (msg) => {
    if (msg?.content) {
      try {
        const event = JSON.parse(msg.content.toString());
        await service.SubscribeEvent(event, channel, msg);
      } catch (error: any) {
        log.error("Error with subscribe service...", error.message);
      }
    }
  });
};

// publish messages
export const PublishMessage = async (
  channel: Channel,
  binding_key: string,
  message: string
) => {
  try {
    channel.publish(config.exchange_name, binding_key, Buffer.from(message));
  } catch (error: any) {
    log.error(error);
  }
};
