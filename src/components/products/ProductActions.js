'use client';
import { Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export function ProductActions({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.variants?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.variants?.sizes?.[0] || null);
  const addItem = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Inventory key logic: "M" if no colors, "M-Red" if colors exist
  const variantKey = selectedColor 
    ? `${selectedSize}-${selectedColor.name}`
    : `${selectedSize}`;

  // Mongoose Map is converted to a plain object in JSON.parse(JSON.stringify())
  const inventory = (product.inventory && product.inventory[variantKey]) !== undefined 
    ? product.inventory[variantKey] 
    : 0; 

  const isOutOfStock = inventory.total <= 0;
  const inventoryNumber = product.inventory.total;  

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
    <div className="space-y-8">
      {product.variants?.colors?.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center">
            Color 
            <span className="text-indigo-600 ml-2 font-semibold bg-indigo-50 px-2 py-0.5 rounded-lg">
              {selectedColor?.name}
            </span>
          </h4>
          <div className="flex gap-4">
            {product.variants.colors.map(color => (
              <button 
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-14 h-14 rounded-full border-2 transition-all p-1 box-content ${selectedColor?.name === color.name ? 'border-indigo-600 scale-110 shadow-xl shadow-indigo-200' : 'border-transparent hover:border-gray-300 hover:scale-105'}`}
              >
                <div className="w-full h-full rounded-full shadow-inner border border-black/10" style={{ backgroundColor: color.hex }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {product.variants?.sizes?.length > 0 && (
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Select Size</h4>
          <div className="flex flex-wrap gap-4">
            {product.variants.sizes.map(size => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[4rem] h-14 px-6 rounded-2xl border-2 text-base font-bold transition-all ${selectedSize === size ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-1' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white hover:bg-gray-50'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-8 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000">
         <Button 
           size="lg" 
           disabled={isOutOfStock || loading} 
           onClick={handleAddToCart}
           className="w-full h-16 rounded-2xl text-xl font-bold shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 hover:shadow-indigo-300"
         >
           {loading ? <Loader2 className="animate-spin" /> : isOutOfStock ? 'Sold Out' : 'Add to Cart'}
         </Button>
         <div className="text-center w-full">
           {isOutOfStock ? (
             <span className="text-rose-500 font-semibold bg-rose-50 px-3 py-1 rounded-lg text-sm inline-block">Out of Stock</span>
           ) : (
             <span className="text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-lg text-sm inline-block tracking-tight">
               ✨ Hurry! Only {inventoryNumber} left in stock
             </span>
           )}
         </div>
      </div>
    </div>
  );
}
