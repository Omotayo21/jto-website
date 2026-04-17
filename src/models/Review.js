import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: String,
  body: { type: String, required: true },
  verified: { type: Boolean, default: false }, // true if user purchased this product
}, {
  timestamps: true,
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
