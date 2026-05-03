'use client';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Boxes, AlertTriangle, Search, Save, Loader2, RefreshCw, Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(null); // stores productId being saved

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (productId, inventory) => {
    setSaving(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventory })
      });
      if (res.ok) {
        toast.success('Stock updated successfully');
        // Update local state to reflect changes
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, inventory } : p));
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast.error('Failed to update stock');
    } finally {
      setSaving(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Inventory Control</h1>
          <p className="text-gray-500 font-bold mt-1 text-xs md:text-sm uppercase tracking-widest opacity-70">Allocate stock among variants</p>
        </div>
        <button onClick={fetchInventory} className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Data
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <Input 
          placeholder="Search inventory by product name or category..." 
          className="h-16 pl-16 rounded-[2rem] bg-white border-gray-100 shadow-xl shadow-gray-100 text-lg"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-8">
        {loading ? (
          <div className="h-64 flex items-center justify-center bg-white rounded-[3rem] border border-gray-50">
            <Loader2 className="animate-spin text-gray-300" size={48} />
          </div>
        ) : filteredProducts.map(product => (
          <InventoryItem 
            key={product._id} 
            product={product} 
            onUpdate={(newInv) => handleUpdateStock(product._id, newInv)}
            isSaving={saving === product._id}
          />
        ))}
      </div>
    </div>
  );
}

function InventoryItem({ product, onUpdate, isSaving }) {
  const [localInventory, setLocalInventory] = useState(product.inventory || {});
  const [hasChanges, setHasChanges] = useState(false);

  // Re-sync local state if product changes (e.g. after save)
  useEffect(() => {
    setLocalInventory(product.inventory || {});
    setHasChanges(false);
  }, [product]);

  const variants = [];
  if (product.variants?.sizes?.length > 0) {
    product.variants.sizes.forEach(size => {
      if (product.variants.colors?.length > 0) {
        product.variants.colors.forEach(color => {
          variants.push({ key: `${size}-${color.name}`, size, color });
        });
      } else {
        variants.push({ key: size, size });
      }
    });
  }

  // If no variants defined, just show a "Total"
  if (variants.length === 0) {
    variants.push({ key: 'total', label: 'Total Stock' });
  }

  const handleQtyChange = (key, val) => {
    const newQty = Math.max(0, parseInt(val) || 0);
    setLocalInventory(prev => ({ ...prev, [key]: newQty }));
    setHasChanges(true);
  };

  // Master Pool is the 'total' field set in the product form
  const masterPool = product.inventory?.total || 0;
  
  // Calculate how much has been allocated to variants
  const allocatedSum = variants
    .filter(v => v.key !== 'total')
    .reduce((acc, v) => acc + (localInventory[v.key] || 0), 0);

  const remaining = masterPool - allocatedSum;

  const handleSave = () => {
    if (allocatedSum > masterPool) {
      toast.error('Please adjust the quantity in stock of product to allocate among sizes');
      return;
    }
    // Keep the 'total' field as the master pool
    const finalInventory = { ...localInventory, total: masterPool };
    onUpdate(finalInventory);
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 border border-gray-50 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
            <img src={product.media?.[0]?.url || '/placeholder.png'} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{product.name}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              {product.category} • {formatCurrency(product.price)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-5 py-3 rounded-2xl flex flex-col items-end border transition-all ${
            remaining < 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-gray-50 border-gray-100 text-gray-500'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest">
                {masterPool} Available in Stock
              </span>
            </div>
            <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider ${remaining < 0 ? 'text-rose-500 animate-pulse' : 'text-gray-400'}`}>
              {remaining < 0 ? 'OVER-ALLOCATED' : `${remaining} Remaining to allocate`}
            </span>
          </div>
          
          <button 
            disabled={!hasChanges || isSaving}
            onClick={handleSave}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
              hasChanges 
                ? 'bg-black text-white hover:bg-[#DAA520] shadow-lg shadow-gray-200 active:scale-95' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Allocation
          </button>
        </div>
      </div>

      <div className="p-8 bg-gray-50/30">
        {variants.length === 1 && variants[0].key === 'total' ? (
          <div className="flex items-center gap-3 p-6 bg-blue-50 text-blue-700 rounded-3xl border border-blue-100">
             <Info size={20} />
             <p className="text-sm font-bold">This product has no size/color variants. Adjust the total quantity in the <Link href={`/management-portal/products/${product._id}`} className="underline">Product Edit</Link> page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {variants.filter(v => v.key !== 'total').map(variant => (
              <div key={variant.key} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3 group hover:border-black transition-all">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 group-hover:text-black transition-colors">
                    {variant.color ? variant.color.name : 'Standard'}
                  </span>
                  <span className="text-sm font-black text-gray-900 leading-none">
                    Size {variant.size || 'N/A'}
                  </span>
                </div>
                <input 
                  type="number"
                  value={localInventory[variant.key] || 0}
                  onChange={e => handleQtyChange(variant.key, e.target.value)}
                  className={`w-full h-10 px-3 rounded-xl border font-bold text-center transition-all ${
                    (localInventory[variant.key] || 0) === 0 ? 'border-gray-100 bg-gray-50/50 text-gray-300' : 'border-black bg-white text-black'
                  } focus:ring-2 focus:ring-black outline-none`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
