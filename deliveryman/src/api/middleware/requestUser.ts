import { Request, Response, NextFunction } from "express";

export const requestUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const delivery = res.locals.delivery;
  if (!delivery) return res.status(403).json({ msg: "Unautorized delivery" });

  next();
};
