import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-12 border-b border-gray-100 pb-6">Secure Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
