import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCurrencyStore = create()(
  persist(
    (set, get) => ({
      currency: 'NGN',
      countryCode: null,
      isDetected: false,

      detectCurrency: async () => {
        // Only call the API once per session
        if (get().isDetected) return;

        try {
          const res = await fetch('https://ipapi.co/json/', {
            signal: AbortSignal.timeout(5000), // 5 second timeout
          });
          const data = await res.json();
          const code = data.country_code || data.country;

          const currency = code === 'NG' ? 'NGN' : 'USD';
          set({ currency, countryCode: code, isDetected: true });
        } catch (error) {
          console.warn('Currency detection failed, defaulting to NGN:', error.message);
          // On failure, default to NGN and mark as detected so we don't retry
          set({ currency: 'NGN', countryCode: null, isDetected: true });
        }
      },
    }),
    {
      name: 'jto-currency',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(name);
          }
        },
      },
    }
  )
);
