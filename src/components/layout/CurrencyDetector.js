'use client';
import { useEffect } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';

export function CurrencyDetector() {
  const detectCurrency = useCurrencyStore((s) => s.detectCurrency);

  useEffect(() => {
    detectCurrency();
  }, [detectCurrency]);

  return null; // This component renders nothing — it only fires the detection
}
