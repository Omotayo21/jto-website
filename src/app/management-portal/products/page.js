import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
export default async function AdminProductsPage() {
  let products = [];

  try {
    await connectDB();
    const docs = await Product.find().sort({ createdAt: -1 }).populate('category');
    products = JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Product Management</h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">Inventory & Catalog Control</p>
        </div>
        <Link href="/management-portal/products/new" className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#800020] transition-all shadow-xl shadow-gray-200 hover:-translate-y-0.5 active:scale-95">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="p-6 border-b border-gray-50">Product</th>
                <th className="p-6 border-b border-gray-50">Category</th>
                <th className="p-6 border-b border-gray-50">Price</th>
                <th className="p-6 border-b border-gray-50">Status</th>
                <th className="p-6 border-b border-gray-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                 const outOfStock = Object.values(product.inventory || {}).every(qty => qty === 0);
                 const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
                 return (
                 <tr key={product._id || product.id} className="hover:bg-gray-100/30 transition-colors border-b border-gray-50 last:border-0 group">
                   <td className="p-6 whitespace-nowrap">
                     <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                         <img src={product.media?.[0]?.url || product.images?.[0]?.url || '/placeholder.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       </div>
                       <span className="font-black text-gray-900 group-hover:text-black transition-colors">{product.name}</span>
                     </div>
                   </td>
                   <td className="p-6 text-gray-500 font-bold capitalize text-sm">{categoryName || 'Uncategorized'}</td>
                   <td className="p-6 font-black text-gray-900 whitespace-nowrap">{formatCurrency(product.price, product.currency || 'NGN')}</td>
                   <td className="p-6">
                      <Badge variant={outOfStock ? 'danger' : product.status === 'active' ? 'success' : 'default'} className="uppercase tracking-widest text-[9px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                        {outOfStock ? 'Out of Stock' : "In Stock"}
                      </Badge>
                   </td>
                   <td className="p-6 text-right">
                     <Link href={`/management-portal/products/${product._id || product.id}`} className="text-white bg-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#800020] shadow-lg shadow-gray-200 transition-all inline-block whitespace-nowrap overflow-hidden">
                       Edit
                     </Link>
                   </td>
                 </tr>
               )})}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                 <Package size={32} />
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No products in catalog</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
