const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_demo';

// Models (Minimal versions for seeding)
const CategorySchema = new mongoose.Schema({ name: String, slug: String, description: String, active: { type: Boolean, default: true } });
const ProductSchema = new mongoose.Schema({
  name: String, slug: String, price: Number, comparePrice: Number, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  media: [{ url: String, type: String, publicId: String }],
  variants: { sizes: [String], colors: [{ name: String, hex: String }] },
  inventory: { type: Map, of: Number },
  status: { type: String, default: 'active' },
  salesCount: { type: Number, default: 0 },
});
const DeliveryZoneSchema = new mongoose.Schema({ name: String, slug: String, fee: Number, active: { type: Boolean, default: true } });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const DeliveryZone = mongoose.models.DeliveryZone || mongoose.model('DeliveryZone', DeliveryZoneSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    await DeliveryZone.deleteMany({});

    // 1. Categories
    const cat1 = await Category.create({ name: 'Accessories', slug: 'accessories', description: 'Essential fashion pieces' });
    const cat2 = await Category.create({ name: 'Apparel', slug: 'apparel', description: 'Premium clothing' });

    // 2. Delivery Zones
    await DeliveryZone.create([
      { name: 'Lagos (Island)', slug: 'lagos-island', fee: 3500 },
      { name: 'Lagos (Mainland)', slug: 'lagos-mainland', fee: 2000 },
      { name: 'Abuja', slug: 'abuja', fee: 5000 },
      { name: 'International (USD)', slug: 'international-usd', fee: 50 } // $50 if in USD? I'll handle conversion in logic
    ]);

    // 3. Products
    await Product.create([
      {
        name: 'Classic Black Hoodie',
        slug: 'classic-black-hoodie',
        price: 15000,
        comparePrice: 20000,
        category: cat2._id,
        media: [
          { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000', type: 'image', publicId: 'demo1' }
        ],
        variants: { sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Black', hex: '#000000' }] },
        inventory: { 'S': 10, 'M': 5, 'L': 2, 'XL': 0 },
        status: 'active'
      },
      {
        name: 'Signature Cap',
        slug: 'signature-cap',
        price: 5000,
        comparePrice: 7000,
        category: cat1._id,
        media: [
          { url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000', type: 'image', publicId: 'demo2' }
        ],
        variants: { sizes: ['One Size'], colors: [{ name: 'Navy', hex: '#000080' }, { name: 'White', hex: '#FFFFFF' }] },
        inventory: { 'One Size-Navy': 20, 'One Size-White': 15 },
        status: 'active'
      }
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
