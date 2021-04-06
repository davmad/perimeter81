import { Schema } from "mongoose";

export const cartItemSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
},
{ 
  _id : false 
});
