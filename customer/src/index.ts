import api from "./api/api";
import mongo_connection from "./database/connectWithMongoDb";
import log from "./utils/logger";
import createServer from "./utils/server";

const port = 8001;
const app = createServer();
mongo_connection();
api(app);
app.listen(port, async () => {
  log.info(`We are Running at http//localhost:${port}`);
});
