'use client';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Boxes, AlertTriangle, Search, Save, Loader2, RefreshCw } from 'lucide-react';
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
          <p className="text-gray-500 font-bold mt-1 text-xs md:text-sm uppercase tracking-widest opacity-70">Stock levels & Variant Management</p>
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

  const totalQty = variants.reduce((acc, v) => acc + (localInventory[v.key] || 0), 0);
  const unallocatedStock = localInventory.total || 0;

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
          <div className={`px-4 py-2 rounded-xl flex flex-col items-end border ${
            totalQty < 5 ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-gray-50 border-gray-100 text-gray-500'
          }`}>
            <div className="flex items-center gap-2">
              {totalQty < 5 && <AlertTriangle size={14} />}
              <span className="text-xs font-black uppercase tracking-widest">{totalQty} Units Available</span>
            </div>
            {unallocatedStock > 0 && (
              <span className="text-[9px] font-bold text-amber-600 mt-1 uppercase italic">
                + {unallocatedStock} Unallocated in Total field
              </span>
            )}
          </div>
          <button 
            disabled={!hasChanges || isSaving}
            onClick={() => {
              onUpdate(localInventory);
              setHasChanges(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
              hasChanges 
                ? 'bg-black text-white hover:bg-[#DAA520] shadow-lg shadow-gray-200' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Updates
          </button>
        </div>
      </div>

      <div className="p-8 bg-gray-50/30">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Unallocated / Total Stock Input */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">
                Unallocated
              </span>
              <span className="text-sm font-black text-amber-900 leading-none">
                Base Pool
              </span>
            </div>
            <input 
              type="number"
              value={localInventory.total || 0}
              onChange={e => handleQtyChange('total', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-amber-200 bg-white text-amber-900 font-bold text-center focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {variants.filter(v => v.key !== 'total').map(variant => (
            <div key={variant.key} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
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
                  (localInventory[variant.key] || 0) < 5 ? 'border-rose-200 bg-rose-50/50 text-rose-600' : 'border-gray-100 bg-gray-50/50 text-gray-900'
                } focus:ring-2 focus:ring-black focus:bg-white`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
