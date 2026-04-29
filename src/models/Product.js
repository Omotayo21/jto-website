import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  
  priceUSD: { type: Number },
  costPrice: { type: Number, default: 0 },
  costPriceUSD: { type: Number, default: 0 },
  currency: { type: String, enum: ['NGN', 'USD'], default: 'NGN' },
  category: { type: String, required: true },
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
