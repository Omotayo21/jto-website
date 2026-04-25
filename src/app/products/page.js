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
    if (category) {
      query.category = category.toLowerCase();
    }
    const snapshot = await Product.find(query).populate('category');
    products = JSON.parse(JSON.stringify(snapshot));
  } catch (error) {
    console.error('Products fetch error:', error);
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex-col gap-8 hidden md:flex h-fit sticky top-24">
         <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">Filters</h2>
         
         <div>
           <h3 className="font-semibold text-gray-800 mb-4 tracking-wide text-sm uppercase">Categories</h3>
           <div className="space-y-2">
             <a href="/products" className={`block hover:text-indigo-600 transition-colors py-1 ${!category ? 'text-indigo-600 font-bold bg-indigo-50 px-3 rounded-lg -ml-3' : 'text-gray-600'}`}>All Products</a>
             <a href="/products?category=clothing" className={`block hover:text-indigo-600 transition-colors py-1 ${category === 'clothing' ? 'text-indigo-600 font-bold bg-indigo-50 px-3 rounded-lg -ml-3' : 'text-gray-600'}`}>Clothing</a>
             <a href="/products?category=accessories" className={`block hover:text-indigo-600 transition-colors py-1 ${category === 'accessories' ? 'text-indigo-600 font-bold bg-indigo-50 px-3 rounded-lg -ml-3' : 'text-gray-600'}`}>Accessories</a>
             <a href="/products?category=electronics" className={`block hover:text-indigo-600 transition-colors py-1 ${category === 'electronics' ? 'text-indigo-600 font-bold bg-indigo-50 px-3 rounded-lg -ml-3' : 'text-gray-600'}`}>Electronics</a>
           </div>
         </div>

        
      </aside>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-8 bg-white p-4 px-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{category ? category : 'All Collection'}</h1>
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium cursor-pointer shadow-sm">
            <option>Latest Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {products.length === 0 ? (
           <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
             <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
             <p className="text-gray-500 max-w-sm">We couldn&apos;t find any products in this category. Try adjusting your filters.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
