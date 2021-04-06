import { Request, Response, NextFunction } from "express";
import { HTTP400Error, HTTP404Error } from "../../../utils/Errors";
import DAL from "../../../DAL"
import stripeAcceptPayment from "../../../services/stripe";

export const checkoutOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user && req.user.authtoken) {
      const order = await DAL.createOrder(req.user);
      if (!(req.body && req.body.number && req.body.exp_month && req.body.exp_year && req.body.cvc)) {
        throw new HTTP400Error("Bad request.");
      }
      const status = await stripeAcceptPayment(req.body, order);
      await DAL.setOrderStatus(order._id, status);
      res.status(200).send({"orderId": order._id, "status": status});
    } else {
      throw new HTTP404Error("User not found");
    }
  } catch (err: any) {
    next(err);
  }
}
