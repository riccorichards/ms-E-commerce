import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import log from "../../utils/logger";

//this function using the zod and receives zof schema to parse it as (body, params and quesry)
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
    } catch (error) {
      if (error instanceof ZodError) {
        log.error(error.message);
        return res.status(404).json(error.errors);
      }
      log.error("Server Internal" + error);
      return res.status(500).json({ err: error, msg: "Server Internal" });
    }
  };
