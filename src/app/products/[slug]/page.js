import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { ProductReviews } from '@/components/products/ProductReviews';

export const revalidate = 60;

export default async function ProductPage({ params }) {
  const { slug } = params;

  await connectDB();
  const productDoc = await Product.findOne({ slug: slug.toLowerCase(), status: 'active' }).populate('category');
  if (!productDoc) return notFound();
  const product = JSON.parse(JSON.stringify(productDoc));

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-16">
      <ProductDetailClient product={product} />

      {/* Reviews */}
      <div className="mt-24 pt-16 border-t border-gray-100">
        <ProductReviews productId={product._id} />
      </div>
    </div>
  );
}
