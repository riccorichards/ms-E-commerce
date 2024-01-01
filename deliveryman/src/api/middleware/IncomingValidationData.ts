import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import log from "../../utils/logger";

export const IncomingValidationData =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        log.error(error.message);
        return res.status(404).json({ err: error.message });
      }
      return res.status(500).json({ err: error, msg: "Unknown Error" });
    }
  };
