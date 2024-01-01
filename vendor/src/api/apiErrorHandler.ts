import { Response } from "express";
import { ZodError } from "zod";

const ApiErrorHandler = (error: unknown, res: Response) => {
  if (error instanceof ZodError) {
    console.error({ err: error.errors });
    return res.status(404).json({ err: error.message });
  }
  return res.status(500).json({ err: error, msg: "Unknown Error" });
};

export default ApiErrorHandler;
