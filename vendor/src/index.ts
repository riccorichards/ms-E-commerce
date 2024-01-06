import api from "./api/api";
import mongo_connection from "./database/connectWithMongoDb";
import VendorService from "./services/vendor.services";
import log from "./utils/logger";
import { CreateChannel } from "./utils/rabbitMQ.utils";
import createServer from "./utils/server";

const runServer = async () => {
  const port = 8004;

  const app = createServer();
  mongo_connection();
  const channel = await CreateChannel();

  if (!channel) {
    log.error("Failed to create RabbitMQ channel. Exiting...");
    process.exit(1);
  }

  api(app, channel);

  app.listen(port, async () => {
    log.info(`We are Running at http//localhost:${port}`);
  });
};

runServer();
