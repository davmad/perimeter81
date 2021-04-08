import { ConnectionOptions, connect } from "mongoose";
import User from "./models/User";
import Order from "./models/Order";
import { HTTP400Error, HTTP404Error } from "../../utils/Errors";

const menu: IMenu = {
  1: {
    id: 1,
    name: "Margherita",
    price: 15
  },
  2: {
    id: 1,
    name: "Marinara",
    price: 16
  },
  3: {
    id: 1,
    name: "Napoletana",
    price: 17
  },
  4: {
    id: 1,
    name: "Montanara",
    price: 18
  }
};

class MongoosDal {
  private connecting: Promise<boolean>;

  constructor () {
    this.connecting = new Promise(r => this.connectDB(r));
  }

  private async connectDB(resolve: Function): Promise<void> {
    try {
      const mongoURI: string = process.env.MONGODB_URI || "mongodb://localhost:27017/perimeter81";
      const options: ConnectionOptions = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      };
      await connect(mongoURI, options);
      console.log("MongoDB Connected...");
      resolve();
    } catch (err) {
      console.error(err.message);
      // Exit process with failure
      process.exit(1);
    }
  }

  private async connects(): Promise<void> {
    await Promise.resolve(this.connecting);
  }

  public getMenu(): IMenu {
    return menu;
  }

  public async createUser(user: IUser): Promise<IBasicUser> {
    await this.connects();
    const newUser = new User(user);
    await newUser.save();
    return { uid: newUser._id, name: newUser.name, email: newUser.email, address: newUser.address };
  }

  public async updateUser(userID: any, user: IUser): Promise<IBasicUser | null> {
    await this.connects();
    const updatedUser = await User.findById(userID);
    if (!updatedUser) {
      return null;
    }
    ["name", "email", "address", "pass"].forEach(prop => {
      if (user[prop]) {
        updatedUser[prop] = user[prop];
      }
    });
    await updatedUser.save();
    return { uid: updatedUser._id, name: updatedUser.name, email: updatedUser.email, address: updatedUser.address };
  }

  public async deleteUser(userID: any): Promise<IBasicUser | null> {
    await this.connects();
    const deletedUser = await User.findById(userID);
    if (!deletedUser) {
      return null;
    }
    await deletedUser.remove();
    return { name: deletedUser.name, email: deletedUser.email, address: deletedUser.address };
  }

  public async getUser(email: string): Promise<IUser | null> {
    await this.connects();
    return await User.findOne({ "email": email });
  }

  public async setUserLoginToken(email: string, token: string): Promise<void> {
    await this.connects();
    await User.updateOne({ "email": email }, { "$set": {"authtoken": token} });
  }

  public async getUserByToken(token: string): Promise<IUser | null> {
    await this.connects();
    return await User.findOne({ "authtoken": token });
  }

  public async removeUserLoginToken(token: string): Promise<void> {
    await this.connects();
    await User.updateOne({ "authtoken": token }, { "$unset": {"authtoken": ""} });
  }

  public async updateUserCart(cart: ICart, user: IUser): Promise<ICart> {
    await this.connects();
    for (let i=0; i<cart.length; i++) {
      if (menu[cart[i].id] && 0 < cart[i].quantity) {
        cart[i].price = menu[cart[i].id].price;
      } else {
        throw new HTTP404Error("Invalid Item/s.");
      }
    }
    await User.findByIdAndUpdate(user._id, { "$set": { "cart": cart } });
    return cart;
  }

  public async addItems2UserCart(cart: ICart, user: IUser): Promise<ICart> {
    await this.connects();
    let newCart: ICart = user.cart || [];
    for (let i=0; i<cart.length; i++) {
      if (menu[cart[i].id]) {
        const ind = newCart.findIndex((item: ICartItem) => item.id == cart[i].id);
        if (-1 < ind) {
          newCart[ind].quantity += cart[i].quantity;
          if (1 > newCart[ind].quantity) {
            newCart.splice(ind, 1);
          } else {
            newCart[ind].price = menu[cart[i].id].price;
          }
        } else {
          if (1 < cart[i].quantity) {
            cart[i].price = menu[cart[i].id].price;
            newCart.push(cart[i]);
          }
        }
      } else {
        throw new HTTP400Error("Bad request - Invalid Item/s.");
      }
    }
    await User.findByIdAndUpdate(user._id, { "$set": { "cart": newCart } });
    return newCart;
  }

  public async createOrder(user: IUser): Promise<IOrder> {
    await this.connects();
    
    if (user.cart && user.cart.length) {
      let total = 0;
      for (let i=0; i<user.cart.length; i++) {
        total += (user.cart[i].quantity * user.cart[i].price);
      }
      const newOrder = new Order({ 
        uid: user._id,
        items: user.cart,
        total
      });
      await newOrder.save();
      await User.findByIdAndUpdate(user._id, { "$unset": { "cart": "" } });
      return newOrder;  
    } else {
      throw new HTTP400Error("Bad request - no items in user cart.");
    }
  }

  public async setOrderStatus(orderId: any, status: string): Promise<void> {
    await Order.findByIdAndUpdate(orderId, { "$set": { "status": status } });
  }

}

const DAL = new MongoosDal();

export default DAL;
