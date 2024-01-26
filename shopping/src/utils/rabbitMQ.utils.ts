import amqplib, { Channel, Connection } from "amqplib";
import config from "../../config/index";
import log from "./logger";
import ShoppingRepo from "../database/repository/shopping.repository";
import initialiazeRepo from "../database/repository/initialiaze.repo";
import ShoppingService from "../services/shopping.service";
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
      if (!channel) throw new Error("Error while creating a new channel");
      return channel;
    }
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
    const shoppingRepo = new ShoppingRepo(
      initialiazeRepo.orderRepository,
      initialiazeRepo.shippingRepository,
      initialiazeRepo.orderIteRepository
    );

    const service = new ShoppingService(shoppingRepo);

    const deliveryQueue = await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.bindQueue(deliveryQueue.queue, config.exchange_name, bindingKey);
    channel.consume(deliveryQueue.queue, async (data) => {
      if (data) {
        const event = JSON.parse(data.content.toString());
        try {
          await service.SubscribeEvent(event, channel, data);
        } catch (error: any) {
          log.error("Error with subscribe service...", error.message);
        }
      }
    });
  } catch (error: any) {
    log.error("Failed to start the subscriber:", error.message);
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
    log.error(error);
  }
};
