import { Model, model, Schema } from "mongoose";
import { cartItemSchema } from "../subschema";
import { IUserDoc } from "../interface";
import { hashPassword } from "../../../utils/auth";

// cart?: ICart;

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  pass: {
    type: String,
    required: true
  },
  authtoken: {
    type: String,
    required: false
  },
  cart: {
    type: [cartItemSchema],
    required: false,
    default: undefined
  }
});

// // Indexes
userSchema.index({ "email" : 1 }, { unique : true });
userSchema.index({ "authtoken" : 1 }, { unique : false });

userSchema.pre("save", async function (this: any, next) {
  const user = this;

  try {
    user.pass = await hashPassword(user.pass);
  return next();
  } catch (e) {
    return next(e);
  }
});

const User: Model<IUserDoc> = model("User", userSchema);

export default User;
