import { Request, Response, NextFunction } from "express";
import { HTTP400Error, HTTP404Error } from "../../../utils/Errors";
import DAL from "../../../DAL";

export const addItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user && req.user.authtoken) {
      if (!Array.isArray(req.body)) {
        throw new HTTP400Error("Bad request.");
      }
      const newCart = await DAL.addItems2UserCart(req.body, req.user);
      res.status(200).send({"newCart": newCart});
    } else {
      throw new HTTP404Error("UUUser not found");
    }
  } catch (err: any) {
    next(err);
  }
}

export const updateItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user && req.user.authtoken) {
      if (!Array.isArray(req.body)) {
        throw new HTTP400Error("Bad request.");
      }
      const newCart = await DAL.updateUserCart(req.body, req.user);
      res.status(200).send({"newCart": newCart});
    } else {
      throw new HTTP404Error("User not found");
    }
  } catch (err: any) {
    next(err);
  }
}
