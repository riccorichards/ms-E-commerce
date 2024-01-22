import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import log from "../utils/logger";

export function ValidateIncomingData<T>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const incomingInputs = plainToClass(dtoClass, req.body);
      if (incomingInputs) {
        const errorsInput = await validate(incomingInputs, {
          validationError: { target: true },
        });

        if (errorsInput.length > 0) {
          return res.status(400).json(errorsInput);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default (error: unknown, res: Response) => {
  log.error("Unknown Error:" + error);
  return res.status(500).json(`Unknown Error: >>>>>> ${error}`);
};
