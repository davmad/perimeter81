import { Router } from "express";
import * as apiCartController from "./controller";
import { checkLoginToken } from "../../../middleware/checks";

const apiCartRoutes = Router();

apiCartRoutes.post("/add", checkLoginToken, apiCartController.addItems);

apiCartRoutes.put("/fill", checkLoginToken, apiCartController.updateItems);

export default apiCartRoutes;
