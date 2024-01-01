import log from "../../utils/logger";

const ErrorHandler = (error: unknown) => {
  if (error instanceof Error) {
    log.error({ err: error.message });
    throw new Error(error.message);
  }
  throw new Error(error + "Unknown Error in Repo");
};

export default ErrorHandler;
