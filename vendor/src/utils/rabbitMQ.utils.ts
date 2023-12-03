import amqplib, { Channel, Connection } from "amqplib";
import config from "../../config/default";
import log from "./logger";
import VendorService from "../services/vendor.services";
// create a channel
export const CreateChannel = async () => {
  try {
    if (config.message_broker_url) {
      const connection: Connection = await amqplib.connect(
        config.message_broker_url
      );
      const channel: Channel = await connection.createChannel();
      await channel.assertExchange(config.exchange_name, "direct", {
        durable: true,
      });
      return channel;
    }
  } catch (error: any) {
    throw new Error(error);
  }
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
    throw new Error(error);
  }
};

// subscribe messages
export const SubscribeMessage = async (
  channel: Channel,
  queueName: string,
  bindingKey: string
): Promise<void> => {
  try {
    const service = new VendorService();
    const deliveryQueue = await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.bindQueue(deliveryQueue.queue, config.exchange_name, bindingKey);
    channel.consume(deliveryQueue.queue, async (data) => {
      if (data) {
        const event = JSON.parse(data.content.toString());
        await service.SubscribeEvent(event, channel, data);
        try {
        } catch (error: any) {
          log.error("Error with subscribe service...", error.message);
        }
      }
    });
  } catch (error: any) {
    log.error("Failed to start the subscriber:", error.message);
  }
};
