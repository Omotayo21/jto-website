import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import { ProductActions } from '@/components/products/ProductActions';
import { MediaCarousel } from '@/components/products/MediaCarousel';
import { FavouriteButton } from '@/components/products/FavouriteButton';
import { ProductReviews } from '@/components/products/ProductReviews';
import { Star } from 'lucide-react';

export const revalidate = 60;

export default async function ProductPage({ params }) {
  const { slug } = params;
  
  let product;
  await connectDB();
  const productDoc = await Product.findOne({ slug, status: 'active' }).populate('category');
  if (productDoc) product = JSON.parse(JSON.stringify(productDoc));
  
  if (!product) return notFound();

  return (
    <div className="space-y-8 mt-8 mb-20">
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-14 shadow-xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-50 -z-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products" className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Back to products</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 sticky top-24">
            <MediaCarousel media={product.media || []} />
          </div>

          <div className="flex flex-col pt-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {product.featured && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-lg">Featured</span>}
                <span className="text-gray-400 font-medium text-sm tracking-widest uppercase">{product.category?.name}</span>
              </div>
              <FavouriteButton productId={product._id} />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">{product.name}</h1>
            
            {product.ratings?.count > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={product.ratings.average >= s ? 'currentColor' : 'none'} />)}
                </div>
                <span className="text-sm font-bold text-gray-400">({product.ratings.count} Verified Reviews)</span>
              </div>
            )}

            <div className="flex items-end gap-4 mb-10">
              <span className="text-4xl font-extrabold text-indigo-600">NGN {product.price.toLocaleString()}</span>
            </div>

            <div className="border-t border-gray-100 pt-10 mb-10">
              <h3 className="font-bold text-gray-900 text-xl mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">{product.description}</p>
            </div>

            <div className="flex-1 bg-gray-50/50 p-8 rounded-3xl border border-gray-100 shadow-sm">
              <ProductActions product={product} />
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id} />
    </div>
  );
}
