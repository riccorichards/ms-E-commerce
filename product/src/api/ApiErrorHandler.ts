import { Response } from "express";
import { ZodError } from "zod";
import log from "../utils/logger";

export function ApiErrorHandler(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    log.error({ err: error.message });
    return res.status(404).json({ msg: "Bad Request", err: error.errors });
  } else if (error instanceof Error) {
    log.error({ err: error.message });
    return res.status(404).json({ msg: "Bad Request", err: error.message });
  }
  return res.status(500).json({ note: "Unknow Error ====>", error });
}
