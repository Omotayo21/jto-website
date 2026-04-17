import mongoose from 'mongoose';

const abandonedCartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    image: String,
    price: Number,
    variant: { size: String, color: String },
    quantity: Number
  }],
  totalValue: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  converted: { type: Boolean, default: false }
  // converted = true when user completes checkout
}, {
  timestamps: true,
});

const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', abandonedCartSchema);
export default AbandonedCart;
