import { Router } from "express";
import parser from "body-parser";

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ limit: "50mb", extended: true, parameterLimit:50000 }));
  router.use(parser.json({ limit: "50mb", strict: true }));
};
