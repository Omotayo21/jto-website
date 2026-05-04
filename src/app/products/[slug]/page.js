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
    const currentCategory = product.category?._id || product.category;
    const currentCategories = product.categories || [];
    
    const relatedDocs = await Product.find({
      status: 'active',
      $or: [
        { category: currentCategory },
        { categories: { $in: [currentCategory, ...currentCategories] } }
      ],
      _id: { $ne: product._id },
    }).limit(4);
    relatedProducts = JSON.parse(JSON.stringify(relatedDocs));
  } catch (err) {
    console.error('Related products fetch error:', err);
  }

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-16">
        <ProductDetailClient product={product} />

        {/* Reviews */}
        <div className="mt-24 pt-16 border-t border-gray-100">
          <ProductReviews productId={product._id} />
        </div>
      </div>

      {/* You May Also Like - Full Width Mustard Background */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#DAA520] py-24 md:py-32 text-white mt-24">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center mb-16 text-center">
              <h2 className="text-3xl md:text-5xl   mb-6">You may also like</h2>
              <div className="w-12 h-[1px] bg-white/40 mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">
                Curated for your style
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {relatedProducts.map(p => (
                <ProductCard key={p._id} product={p} light={true} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
