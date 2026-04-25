import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { ProductCard } from '@/components/products/ProductCard';

export const revalidate = 60;

export default async function ProductsPage({ searchParams }) {
  const category = searchParams.category;

  let products = [];
  try {
    await connectDB();
    let query = { status: 'active' };
    if (category) query.category = category.toLowerCase();
    const snapshot = await Product.find(query).populate('category');
    products = JSON.parse(JSON.stringify(snapshot));
  } catch (error) {
    console.error('Products fetch error:', error);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
      {/* ── Filter/Sort Bar ── */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] hover:text-[#800020] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
          </button>

          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-500">
            Sort by:
            <span className="text-black font-bold">Featured</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-[0.15em]">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Category Title ── */}
      {category && (
        <h1 className="text-2xl md:text-3xl serif-font italic capitalize mb-10">{category}</h1>
      )}

      {/* ── Grid ── */}
      {products.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-3xl serif-font italic text-gray-200 mb-3">No pieces found</p>
          <p className="text-xs uppercase tracking-widest text-gray-300 font-black">Check back soon for new arrivals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
