import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';

export const revalidate = 60;

export default async function ProductsPage({ searchParams }) {
  const category = searchParams.category;
  const q = searchParams.q;
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;
  const sort = searchParams.sort || '-createdAt';

  const isNewIn = category?.toLowerCase() === 'new';

  let products = [];
  try {
    await connectDB();
    let query = { status: 'active' };
    
    // For "New In" — show all products, sorted newest first
    // For other categories — search both `categories` array and legacy `category` string
    if (category && !isNewIn) {
      const catLower = category.toLowerCase();
      query.$or = [
        { categories: catLower },
        { category: catLower }
      ];
    }
    
    if (q) {
      query.name = { $regex: q, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // "New In" always sorts newest first
    const effectiveSort = isNewIn ? '-createdAt' : sort;

    const snapshot = await Product.find(query)
      .sort(effectiveSort);
      
    products = JSON.parse(JSON.stringify(snapshot));
  } catch (error) {
    console.error('Products fetch error:', error);
  }

  // Page title
  let pageTitle = null;
  if (isNewIn) {
    pageTitle = 'New In';
  } else if (category) {
    pageTitle = category;
  } else if (q) {
    pageTitle = null; // handled below
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
      {/* ── Filter/Sort Bar ── */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
        <ProductFilters />

        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-[0.15em]">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Category / Search Title ── */}
      {pageTitle && (
        <h1 className="text-2xl md:text-3xl   capitalize mb-10">{pageTitle}</h1>
      )}
      {q && (
        <h1 className="text-2xl md:text-3xl   mb-10">Search: &ldquo;{q}&rdquo;</h1>
      )}

      {/* ── Grid ── */}
      {products.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-3xl   text-gray-200 mb-3">No pieces found</p>
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
