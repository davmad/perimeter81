import { Request, Response, NextFunction } from "express";
import { HTTP404Error } from "../../../utils/Errors";
import DAL from "../../../DAL"

export const getMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = DAL.getMenu();
    if (!menu) {
      throw new HTTP404Error("Menu not found");
    }
    res.status(201).send({"menu": menu});
  } catch (err: any) {
    next(err);
  }
}
