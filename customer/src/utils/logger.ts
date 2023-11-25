import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  transport: {
    target: "pino-pretty",
    options: {
      colorized: true,
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time": "${dayjs().format()}"`,
});

export default log;