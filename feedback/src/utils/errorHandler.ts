import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { FeedbackValidation } from "../database/validation/feedback.validation";
import { plainToClass } from "class-transformer";

export async function validateIncomingData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const incomingFeedInput = plainToClass(FeedbackValidation, req.body);

  const inputErrors = await validate(incomingFeedInput, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  } else {
    next();
  }
}
