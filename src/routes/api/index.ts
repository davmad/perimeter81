import { Router } from "express";
import userRoutes from "./user/routes";
import menuRoutes from "./menu/routes";
import cartRoutes from "./cart/routes";
import orderRoutes from "./order/routes";

const apiRoutes = Router();

apiRoutes.use("/user", userRoutes);

apiRoutes.use("/menu", menuRoutes);

apiRoutes.use("/cart", cartRoutes);

apiRoutes.use("/order", orderRoutes);

export default apiRoutes;
