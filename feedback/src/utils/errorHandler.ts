import { Response } from "express";

export const incomingErrorHandler = (errors: [], res: Response) => {
  if (errors.length > 0) {
    const message = errors
      .map((error: any) => Object.values(error.constraints))
      .join(", ");
    return res.status(400).json({ msg: message });
  }
};
