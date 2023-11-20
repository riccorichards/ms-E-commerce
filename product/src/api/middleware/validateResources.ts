import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import log from "../../utils/logger";
export const validateIncomingData =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error: any) {
      log.error(error.message);
      return res.status(400).json(error.errors); // errors is an object from zod where store errors with msg
    }
  };
