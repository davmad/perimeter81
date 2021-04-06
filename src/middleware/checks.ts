import { Request, Response, NextFunction } from "express";
import DAL from "../DAL";
import { HTTP403Error } from "../utils/Errors";

export const checkLoginToken = async (req: Request, res: Response, next: NextFunction) => {
  const authErr = new HTTP403Error("You are not authorized to request this!");
  if (typeof req.headers.authorization === "undefined") {
    next(authErr);
  } else {
    (req as any).user = await DAL.getUserByToken(req.headers.authorization);
    if (!(req as any).user) {
      next(authErr);
    } else {
      next();
    }
  }
};
