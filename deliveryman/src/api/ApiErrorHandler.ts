import { Response } from "express";
import { ZodError } from "zod";
import log from "../utils/logger";

export function ApiErrorHandler(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    log.error(error.message);
    return res.status(400).json(error.errors);
  } else if (error instanceof Error) {
    log.error(error.message);
    return res.status(400).json(error.message);
  }
  return res.status(500).json("Unknown Error" + error);
}
