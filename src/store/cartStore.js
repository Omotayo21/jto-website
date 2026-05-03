import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,

  // Sync with Backend
  syncWithBackend: async (newItems) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newItems }),
      });
      const data = await res.json();
      if (!data.success) {
        console.error('Failed to sync cart:', data.error);
      }
    } catch (error) {
      console.error('Cart sync error:', error);
    }
  },

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success) {
        set({ items: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex(
      (i) => i.productId === item.productId &&
             i.variant?.size === item.variant?.size &&
             i.variant?.color?.name === item.variant?.color?.name
    );

    let newItems;
    if (existingIndex > -1) {
      newItems = [...currentItems];
      newItems[existingIndex].quantity += item.quantity || 1;
    } else {
      newItems = [...currentItems, { ...item, quantity: item.quantity || 1 }];
    }

    set({ items: newItems });
    toast.success('Item added to cart');
    await get().syncWithBackend(newItems);
  },

  removeItem: async (productId, variant) => {
    const newItems = get().items.filter(
      (i) => !(i.productId === productId && 
               i.variant?.size === variant?.size && 
               i.variant?.color?.name === variant?.color?.name)
    );
    set({ items: newItems });
    toast.success('Item removed from cart');
    await get().syncWithBackend(newItems);
  },

  updateQuantity: async (productId, variant, quantity) => {
    if (quantity <= 0) {
      await get().removeItem(productId, variant);
      return;
    }
    const newItems = get().items.map((i) => {
      if (i.productId === productId && 
          i.variant?.size === variant?.size && 
          i.variant?.color?.name === variant?.color?.name) {
        return { ...i, quantity };
      }
      return i;
    });
    set({ items: newItems });
    await get().syncWithBackend(newItems);
  },

  clearCart: async () => {
    set({ items: [] });
    try {
      await fetch('/api/cart', { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to clear backend cart:', error);
    }
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
