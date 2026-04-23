import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    image: String,
    variant: { 
      size: String, 
      color: {
        name: String,
        hex: String
      }
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  delivery: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zone: String,
    fee: { type: Number, required: true },
    notes: String
  },
  payment: {
    provider: { type: String, default: 'paystack' },
    reference: String,
    status: String,
    amount: Number,
    currency: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  coupon: {
    code: String,
    discount: Number
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true }
}, {
  timestamps: true,
});

// Check if model exists and if so, delete it to ensure the new schema is applied
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

const Order = mongoose.model('Order', orderSchema);
export default Order;
