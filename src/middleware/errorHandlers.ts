import { Request, Response, NextFunction, Router } from "express";
import * as Errors from "../utils/Errors";

const handle404Error = (router: Router) => {
  router.use((req: Request, res: Response, next: NextFunction) => {
    Errors.notFoundError(req, res, next);
  });
};

const handleResponseError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    Errors.responseError(err, res, next);
  });
};

export default [handle404Error, handleResponseError];
