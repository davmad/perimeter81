import { Request, Response, NextFunction } from "express";
import { HTTP400Error, HTTP404Error, HTTP409Error } from "../../../utils/Errors";
import { comparePassword, getUserLoginToken } from "../../../utils/auth";
import DAL from "../../../DAL";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await DAL.createUser(req.body);
    res.status(201).send({"newUser": user});
  } catch (err: any) {
    if (11000 == err.code) {
      err = new HTTP409Error("Conflict - user already exists");
    }
    next(err);
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(req.params && req.params.user_id)) {
      throw new HTTP400Error("Bad request.");
    }
    const user = await DAL.updateUser(req.params.user_id, req.body);
    if (!user) {
      throw new HTTP404Error("User not found");
    }
    res.status(200).send({"user": user});
  } catch (err: any) {
    if ('ObjectId' == err.kind) {
      err = new HTTP404Error("User not found");
    }
    next(err);
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(req.params && req.params.user_id)) {
      throw new HTTP400Error("Bad request.");
    }
    const user = await DAL.deleteUser(req.params.user_id);
    if (!user) {
      throw new HTTP404Error("User not found");
    }
    res.status(200).send({"status": "deleted"});
  } catch (err: any) {
    if ('ObjectId' == err.kind) {
      err = new HTTP404Error("User not found");
    }
    next(err);
  }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req.body && req.body.email && req.body.pass)) {
    throw new HTTP400Error("Bad request.");
  }
  try {
    const user = await DAL.getUser(req.body.email);
    if (!user || !(await comparePassword(req.body.pass, user.pass))) {
      throw new HTTP404Error("User not found");
    }
    if (user.authtoken) {
      throw new HTTP400Error("Bad request - user already logged in.");
    }
    const userLoginToken = await getUserLoginToken(user);
    await DAL.setUserLoginToken(user.email, userLoginToken);
    res.status(200).send({"userLoginToken": userLoginToken});
  } catch (err: any) {
    next(err);
  }
}

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user && req.user.authtoken) {
      await DAL.removeUserLoginToken(req.user.authtoken);
      res.status(200).send({"status": "OK"});
    } else {
      throw new HTTP404Error("User not found");
    }
  } catch (err: any) {
    next(err);
  }
}
