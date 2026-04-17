import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { ProductCard } from '@/components/products/ProductCard';

export const revalidate = 60;

export default async function Home() {
  let products = [];

  try {
    await connectDB();
    const snapshot = await Product.find({ status: 'active' }).limit(8).populate('category');
    products = JSON.parse(JSON.stringify(snapshot));
  } catch (error) {
    console.error('Home Products Fetch Error:', error);
  }

  return (
    <div className="space-y-16">
      <section className="relative bg-gray-900 text-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-black opacity-90" />
        <div className="relative px-8 py-24 sm:px-16 sm:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">Discover the Extraordinary</h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl">
            Shop the latest trends with exclusive deals. Elevated quality and unmatched performance wrapped in an elegant aesthetic.
          </p>
          <Link href="/products" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl border border-transparent hover:scale-105">
            Shop Now
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Products</h2>
          <Link href="/products" className="text-indigo-600 font-semibold hover:underline">View all Collection &rarr;</Link>
        </div>
        
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No products available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
