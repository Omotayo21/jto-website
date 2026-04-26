import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { ProductReviews } from '@/components/products/ProductReviews';
import { ProductCard } from '@/components/products/ProductCard';

export const revalidate = 60;

export default async function ProductPage({ params }) {
  const { slug } = params;

  await connectDB();
  const productDoc = await Product.findOne({ slug: slug.toLowerCase(), status: 'active' }).populate('category');
  if (!productDoc) return notFound();
  const product = JSON.parse(JSON.stringify(productDoc));

  // Fetch related products (same category, excluding current)
  let relatedProducts = [];
  try {
    const relatedDocs = await Product.find({
      status: 'active',
      category: product.category?._id || product.category,
      _id: { $ne: product._id },
    }).limit(4);
    relatedProducts = JSON.parse(JSON.stringify(relatedDocs));
  } catch (err) {
    console.error('Related products fetch error:', err);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-16">
      <ProductDetailClient product={product} />

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 pt-16 border-t border-gray-100">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-2xl md:text-3xl serif-font italic mb-3">You May Also Like</h2>
            <div className="w-10 h-[1px] bg-black mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Curated for your taste
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-24 pt-16 border-t border-gray-100">
        <ProductReviews productId={product._id} />
      </div>
    </div>
  );
}
