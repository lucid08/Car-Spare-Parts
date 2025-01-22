import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      totalPrice: { // Adding totalPrice field
        type: Number,
        required: true,
        default: function() {
          return this.quantity * this.price; // Default calculation
        }
      }
    }
  ],
  totalPrice: { 
    type: Number, 
    default: 0 
  }
});


export const Cart = mongoose.model('Cart', cartSchema);
