import log from "../../utils/logger";

export const RepoErrorHandler = (error: unknown) => {
  if (error instanceof Error) {
    log.error(error.message);
    throw new Error(error.message);
  }
  throw new Error("Unknown Error: " + error);
};
