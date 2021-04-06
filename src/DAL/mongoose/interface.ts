import { Document } from "mongoose";

export interface IUserDoc extends IUserType, Document {
  [key:string]: any;
}

export interface IOrderDoc extends IOrderType, Document {
  [key:string]: any;
}
