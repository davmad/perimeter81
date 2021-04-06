import { Router } from "express";
import * as apiOrderController from "./controller";
import { checkLoginToken } from "../../../middleware/checks";

const apiOrderRoutes = Router();

apiOrderRoutes.post("/checkout", checkLoginToken, apiOrderController.checkoutOrder);

export default apiOrderRoutes;
