import { Model, model, Schema } from "mongoose";
import { cartItemSchema } from "../subschema";
import { IOrderDoc } from "../interface";

const orderSchema: Schema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  items: {
    type: [cartItemSchema],
    required: false,
    default: undefined
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "pending"
  }
});

// // Indexes
orderSchema.index({ "uid" : 1 }, { unique : false });

const Order: Model<IOrderDoc> = model("Order", orderSchema);

export default Order;
