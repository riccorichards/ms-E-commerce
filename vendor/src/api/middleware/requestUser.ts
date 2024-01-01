import { Request, Response, NextFunction } from "express";

export const requestUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = res.locals.vendor;
  if (!vendor)
    return res.status(403).json({ msg: "Could not found the vendor..." });

  next();
};
