import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      clearUser: () => set({ user: null }),
      toggleFavourite: (productId) => set((state) => {
        if (!state.user) return state;
        const favourites = [...(state.user.favourites || [])];
        const index = favourites.indexOf(productId);
        if (index > -1) {
          favourites.splice(index, 1);
        } else {
          favourites.push(productId);
        }
        return { user: { ...state.user, favourites } };
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
