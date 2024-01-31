import amqplib, { Channel, Connection } from "amqplib";
import config from "../../config/index";
import log from "./logger";
// create a channel
export const CreateChannel = async () => {
  try {
    if (config.message_broker_url) {
      //define the connetion process with RabbitMQ server (in my case it is in my local machine)
      const connection: Connection = await amqplib.connect(
        config.message_broker_url
      );
      //creating the channel
      const channel: Channel = await connection.createChannel();
      //and define exchange in this channel
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

// publish messages
export const PublishMessage = async (
  channel: Channel, //for publishing our our messages we need to define the channel
  binding_key: string, // the binding key (it is used for simplify the search process)
  message: string // and the data (msg)
) => {
  try {
    channel.publish(config.exchange_name, binding_key, Buffer.from(message));
  } catch (error: any) {
    log.error(error);
  }
};
