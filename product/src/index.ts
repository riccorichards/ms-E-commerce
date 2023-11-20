import log from "./utils/logger";
import createServer from "./utils/server";
import config from "config";

const port = config.get<number>("port");
const app = createServer();


app.listen(port, async () => {
  log.info(`We are Running at http//localhost:${port}`);
});
