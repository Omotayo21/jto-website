'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { FavouriteButton } from '@/components/products/FavouriteButton';
import { toast } from 'react-hot-toast';

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center py-4 text-left text-sm font-medium text-gray-800 hover:text-black transition-colors"
      >
        <span>{title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open
            ? <line x1="5" y1="12" x2="19" y2="12" />
            : <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>
          }
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm text-gray-500 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export function ProductDetailClient({ product }) {
  const media = (product.media || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.variants?.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product.variants?.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { user } = useAuthStore();

  const inventoryTotal = product.inventory?.total || 0;
  const isOutOfStock = inventoryTotal <= 0;
  const activeMedia = media[activeIdx];

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please log in to add items to your cart'); return; }
    if (!selectedSize && product.variants?.sizes?.length > 0) { toast.error('Please select a size'); return; }
    setLoading(true);
    try {
      await addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: media[0]?.url || '/placeholder.png',
        variant: { size: selectedSize, color: selectedColor },
        quantity,
      });
      openCart();
    } catch {
      toast.error('Could not add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

      {/* ── LEFT: Thumbnails + Main Image ── */}
      <div className="lg:flex-1 flex gap-4">
        {/* Vertical thumbnails strip */}
        {media.length > 1 && (
          <div className="flex flex-col gap-2 w-16 shrink-0">
            {media.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-16 h-20 overflow-hidden border-2 transition-all ${
                  activeIdx === i ? 'border-black' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={item.url}
                  alt={`View ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="flex-1 bg-[#f8f8f8] overflow-hidden aspect-[3/4]">
          {activeMedia ? (
            activeMedia.type === 'video' ? (
              <video
                src={activeMedia.url}
                className="w-full h-full object-cover"
                controls autoPlay muted loop playsInline
              />
            ) : (
              <img
                src={activeMedia.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-400 uppercase tracking-widest">No image</span>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Product Info ── */}
      <div className="lg:w-[380px] xl:w-[420px] shrink-0 space-y-6">
        {/* Category + Favourite */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            {product.category?.name || product.category || 'Collection'}
          </p>
          <FavouriteButton productId={product._id} />
        </div>

        {/* Product name */}
        <h1 className="text-3xl serif-font italic leading-snug text-black">{product.name}</h1>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <p className="text-xl font-medium text-black">
            ₦{product.price.toLocaleString()}
          </p>
          {product.priceUSD && (
            <p className="text-sm text-gray-400 font-medium">
              / ${product.priceUSD.toLocaleString()}
            </p>
          )}
        </div>

        {/* Colors */}
        {product.variants?.colors?.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Colour: <span className="text-black">{selectedColor?.name}</span>
            </p>
            <div className="flex gap-2">
              {product.variants.colors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedColor?.name === c.name ? 'border-black scale-110' : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.variants?.sizes?.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-5 py-2 text-xs font-bold border transition-all ${
                    selectedSize === s
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Accordion: Product Info & Shipping */}
        <div className="border-t border-gray-200 pt-2">
          <AccordionItem title="Product Information">
            <p>{product.description}</p>
          </AccordionItem>
          <AccordionItem title="Shipping Information">
            <p>Lagos delivery: 2–4 working days. International: 7–10 working days. Express shipping available on request.</p>
          </AccordionItem>
          <AccordionItem title="Returns & Exchanges">
            <p>Items may be returned within 14 days of delivery in original condition. Contact us to initiate a return.</p>
          </AccordionItem>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Quantity</p>
          <div className="flex items-center gap-0 border border-gray-200 w-fit">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
            >
              −
            </button>
            <span className="w-10 h-10 flex items-center justify-center text-sm font-bold border-x border-gray-200">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => Math.min(inventoryTotal || 10, q + 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Stock warning */}
        {!isOutOfStock && inventoryTotal <= 5 && (
          <p className="text-xs text-amber-700 font-medium">
            ⚠ Only {inventoryTotal} left in stock
          </p>
        )}

        {/* Shipping note */}
        <p className="text-[10px] text-gray-400 font-medium">
          <span className="underline underline-offset-2 cursor-pointer">Shipping</span> calculated at checkout.
        </p>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || loading}
          className="w-full py-4 border-2 border-black rounded-full text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:border-gray-200 disabled:text-gray-300"
        >
          {loading ? 'Adding…' : isOutOfStock ? 'Sold Out' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
