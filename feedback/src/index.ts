import log from "./utils/logger";
import createServer from "./utils/server";
import config from "../config";
import "reflect-metadata";

async function runService() {
  const port = config.port;
  const app = await createServer();

  app.listen(port, async () => {
    log.info(`We are Running at http//localhost:${port}`);
  });
}

runService();
