import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },       // NGN price
  priceUSD: { type: Number, default: 0 },         // USD price
  costPrice: { type: Number, default: 0 },         // Cost in NGN
  costPriceUSD: { type: Number, default: 0 },      // Cost in USD
  // Multi-category support (array of slugs)
  categories: [{ type: String }],
  // Keep legacy single category for backward compat
  category: { type: String },
  tags: [String],
  media: [{
    type: { type: String, enum: ['image', 'video'] },
    url: String,
    publicId: String,
    order: Number
  }],
  variants: {
    sizes: { type: [String], required: true }, // required on every product
    colors: [{        // optional — not all products have colors
      name: String,
      hex: String
    }]
  },
  inventory: { type: Map, of: Number },
  // inventory key: "M" if no colors, "M-Red" if colors exist
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false },
  salesCount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// Check if model exists and if so, delete it to ensure the new schema is applied
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product = mongoose.model('Product', productSchema);
export default Product;

