import { Router } from "express";
import * as apiMenuController from "./controller";

const apiMenuRoutes = Router();

apiMenuRoutes.get("/", apiMenuController.getMenu);

export default apiMenuRoutes;
