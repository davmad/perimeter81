import { Router } from "express";
import apiRoutes from "./api";

const routes = Router();

routes.use("/api", apiRoutes);

routes.use("/cart", apiRoutes);

routes.use("/order", apiRoutes);

export default routes;
