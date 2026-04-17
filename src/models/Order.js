import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    image: String,
    variant: { size: String, color: String },
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
    zone: { type: String, enum: ['island', 'mainland', 'outside-lagos', 'outside-nigeria'] },
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

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
