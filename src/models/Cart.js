import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    image: String,
    variant: { 
      size: String, 
      color: { name: String, hex: String } 
    },
    quantity: { type: Number, default: 1 }
  }],
}, {
  timestamps: true,
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;
