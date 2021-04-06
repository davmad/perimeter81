declare type Wrapper = ((router: import("express").Router) => void);

declare interface ITopLevelError extends Error {
  statusCode?: number;
  name: string;
  status?: number;
  type?: string;
}

declare interface IMenuItem {
  id: number;
  name: string;
  price: number;
}

declare interface IMenu {
  [key: number]: IMenuItem
}

declare interface ICartItem {
  id: number;
  price: number;
  quantity: number;
}

declare type ICart = ICartItem[];

declare interface IBasicUser {
  name: string;
  email: string;
  address: string;
  cart?: ICart;
  [key: string]: any;
}
declare interface IUserType extends IBasicUser {
  pass: string;
  authtoken?: string;
}

declare interface IUser extends IUserType {
  _id?: any;
}

declare interface IOrderType {
  uid: any;
  date: Date;
  items: ICart;
  total: number;
  status: string;
}

declare interface IOrder extends IOrderType {
  _id?: any;
}

declare interface ICard {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}

declare namespace Express {
  export interface Request {
    user?: IUser
  }
}