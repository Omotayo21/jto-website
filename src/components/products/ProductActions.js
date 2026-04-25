'use client';
import * as LucideIcons from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

// Safe icon component helper
const Icon = ({ name, size = 20, ...props }) => {
  const LucidIcon = LucideIcons[name];
  if (!LucidIcon) return null;
  return <LucidIcon size={size} {...props} />;
};

export function ProductActions({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.variants?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.variants?.sizes?.[0] || null);
  const addItem = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const inventoryNumber = product.inventory?.total || 0;  
  const isOutOfStock = inventoryNumber <= 0;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to your cart');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setLoading(true);
    try {
      await addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.media?.[0]?.url || '/placeholder.png',
        variant: { size: selectedSize, color: selectedColor },
        quantity: 1
      });
      openCart();
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {product.variants?.colors?.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Color: <span className="text-black">{selectedColor?.name}</span>
          </h4>
          <div className="flex gap-4">
            {product.variants.colors.map(color => (
              <button 
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border transition-all ${selectedColor?.name === color.name ? 'border-black p-0.5' : 'border-transparent hover:border-gray-300'}`}
              >
                <div className="w-full h-full rounded-full border border-black/5" style={{ backgroundColor: color.hex }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {product.variants?.sizes?.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Size</h4>
          <div className="flex flex-wrap gap-3">
            {product.variants.sizes.map(size => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-2 border transition-all text-xs font-bold ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-100 text-gray-400 hover:border-black hover:text-black'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
         <button 
           disabled={isOutOfStock || loading} 
           onClick={handleAddToCart}
           className="w-full h-14 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#800020] transition-colors disabled:bg-gray-100 disabled:text-gray-400"
         >
           {loading ? <Icon name="Loader2" className="animate-spin mx-auto" size={18} /> : isOutOfStock ? 'Sold Out' : 'Add to Bag'}
         </button>
         
         {!isOutOfStock && (
           <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-black">
             Limited Stock: Only {inventoryNumber} available
           </p>
         )}
      </div>
    </div>
  );
}
