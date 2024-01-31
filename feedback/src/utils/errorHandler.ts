import { length, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { FeedbackValidation } from "../database/validation/feedback.validation";
import { plainToClass } from "class-transformer";

// the function is a middleware, it check the incoming data and validated
export async function validateIncomingData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // plainToClass ==> first argument is what we are waiting and second what we receiving
  const incomingFeedInput = plainToClass(FeedbackValidation, req.body);

  // validate checks the incomingFeedInput
  const inputErrors = await validate(incomingFeedInput, {
    validationError: { target: true },
  });

  //and if length is more than 0 that means we have one error at least
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  } else {
    next(); // if not we need to enter data to our system
  }
}
