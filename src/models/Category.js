import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: String,
  image: String,
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
