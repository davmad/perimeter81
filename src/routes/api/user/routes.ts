import { Router } from "express";
import * as apiUserController from "./controller";
import { checkLoginToken } from "../../../middleware/checks";

const apiUserRoutes = Router();

apiUserRoutes.post("/", apiUserController.createUser);

apiUserRoutes.put("/:user_id", checkLoginToken, apiUserController.updateUser);

apiUserRoutes.delete("/:user_id", apiUserController.deleteUser);

apiUserRoutes.post("/login", apiUserController.loginUser);

apiUserRoutes.get("/logout", checkLoginToken, apiUserController.logoutUser);

export default apiUserRoutes;
