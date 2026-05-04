'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, ChevronRight, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function CheckoutForm() {
  const items = useCartStore(state => state.items);
  const currency = useCurrencyStore((s) => s.currency);
  const isNigeria = currency === 'NGN';

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '',
    country: isNigeria ? 'Nigeria' : '', notes: ''
  });
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountVal, setDiscountVal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [error, setError] = useState('');

  // Fetch delivery zones based on detected currency/location
  useEffect(() => {
    const zoneType = isNigeria ? 'domestic' : 'international';
    fetch(`/api/delivery-zones?type=${zoneType}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setZones(data.data);
          if (data.data.length > 0) {
            setSelectedZone(data.data[0]);
          }
        }
      });
  }, [isNigeria]);

  // Update country default when currency changes
  useEffect(() => {
    if (isNigeria) {
      setFormData(prev => ({ ...prev, country: 'Nigeria' }));
    }
  }, [isNigeria]);

  const getItemPrice = (item) => {
    return currency === 'USD' && item.priceUSD ? item.priceUSD : item.price;
  };

  const rawTotal = items.reduce((acc, item) => {
    return acc + (getItemPrice(item) * item.quantity);
  }, 0);

  // For domestic zones use fee (NGN), for international use feeUSD
  const getZoneFee = (zone) => {
    if (!zone) return 0;
    if (isNigeria) {
      // Use effective fee (considers pricing overrides)
      return zone.effectiveFee ?? zone.fee;
    } else {
      return zone.feeUSD || 0;
    }
  };

  const deliveryFee = getZoneFee(selectedZone);
  const total = Math.max(rawTotal - discountVal + deliveryFee, 0);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code: couponCode, cartTotal: rawTotal }),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await res.json();
      if (result.success) {
        let discount = result.data.discount;
        // If coupon returns NGN discount but we're in USD mode, convert roughly
        if (currency === 'USD') {
          discount = Math.ceil(discount / 1500);
        }
        setDiscountVal(discount);
        toast.success(`Coupon applied! Discount: ${formatCurrency(discount, currency)}`);
      } else {
        setError(result.error);
        setDiscountVal(0);
      }
    } catch {
      setError('Coupon validation failed');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) return setError('Cart is empty.');
    if (!selectedZone) return setError('Please select a delivery zone.');

    setLoading(true);
    setError('');
    const t = toast.loading('Initialising secure payment...');
    try {
      const res = await fetch('/api/payment/initialise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          delivery: {
            ...formData,
            zone: selectedZone.slug,
            fee: deliveryFee
          },
          couponCode: discountVal > 0 ? couponCode : null,
          email: formData.email,
          currency
        })
      });
      const data = await res.json();
      if (data.success && data.data?.authorization_url) {
        toast.success('Redirecting to payment gateway...', { id: t });
        window.location.href = data.data.authorization_url;
      } else {
        const msg = data.error || 'Payment initialization failed';
        setError(msg);
        toast.error(msg, { id: t });
      }
    } catch (err) {
      toast.error('System Error. Please try again.', { id: t });
      setError('System Error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatZoneFee = (zone) => {
    const fee = getZoneFee(zone);
    if (isNigeria) {
      return `₦${fee.toLocaleString()}`;
    } else {
      return `$${fee.toLocaleString()}`;
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#FFFCE0] p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
        <h2 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3 ">
          <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-sans not-italic">1</span>
          Delivery Details
        </h2>
        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
          <Input required placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="h-14 rounded-xl" />
          <div className="grid grid-cols-2 gap-6">
            <Input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-14 rounded-xl" />
            <Input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-14 rounded-xl" />
          </div>
          <Input required placeholder="Street Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-14 rounded-xl" />
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">
                {isNigeria ? 'Delivery Zone' : 'Shipping Destination'}
              </label>
              <select 
                required
                className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-black transition-all font-medium"
                value={selectedZone?.slug || ''}
                onChange={(e) => setSelectedZone(zones.find(z => z.slug === e.target.value))}
              >
                {zones.length === 0 && (
                  <option value="">No zones available</option>
                )}
                {zones.map(zone => (
                  <option key={zone.slug} value={zone.slug}>
                    {zone.name} ({formatZoneFee(zone)})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase text-gray-400 ml-1">City</label>
               <Input required placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-14 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Input required placeholder="State / Province" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="h-14 rounded-xl" />
            <Input 
              required 
              placeholder="Country" 
              value={formData.country} 
              onChange={e => setFormData({...formData, country: e.target.value})} 
              className="h-14 rounded-xl" 
              readOnly={isNigeria}
            />
          </div>
          <Input placeholder="Order Notes (Optional)" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="h-14 rounded-xl" />
        </form>
      </div>

      <div className="bg-[#FFFCE0] p-10 rounded-[2.5rem] text-black flex flex-col shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3 ">
          <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm  border border-white/20">2</span>
          Order Summary
        </h2>
        
        <div className="flex-1 overflow-y-auto mb-8 space-y-6 max-h-[400px] pr-4 custom-scrollbar">
          {items.map((item, idx) => (
             <div key={idx} className="flex gap-4 group">
               <div className="w-20 h-20 rounded-2xl overflow-hidden  p-1 shrink-0 ">
                 <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover rounded-xl" />
               </div>
               <div className="flex-1">
                 <h4 className="font-bold text-black group-hover:text-gray-300 transition-colors line-clamp-1">{item.name}</h4>
                 <p className="text-xs  mt-1 uppercase tracking-wider font-black text-black">
                   {item.variant?.size} {item.variant?.color && `| ${item.variant.color.name}`}
                 </p>

                 <div className="flex justify-between items-center mt-2">
                   <span className="text-xs bg-[#FFFCE0]/10 px-2 py-0.5 rounded text-black">Qty: {item.quantity}</span>
                    <span className="font-black text-black">
                      {formatCurrency(getItemPrice(item) * item.quantity, currency)}
                    </span>
                 </div>
               </div>
             </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-white/10 space-y-6">
           <div className="flex gap-3">
             <Input 
                placeholder="PROMO CODE" 
                value={couponCode} 
                onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                disabled={discountVal > 0} 
                className="bg-[#FFFCE0]/30 text-black h-14 rounded-xl placeholder:text-gray-600 border border-black  " 
             />
             {discountVal > 0 ? (
               <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/30">
                 <CheckCircle2 size={24}/>
               </div>
             ) : (
               <Button onClick={handleApplyCoupon} disabled={validatingCoupon || !couponCode} className="h-14 px-8 rounded-xl bg-gray-500 hover:bg-black  ">Apply</Button>
             )}
           </div>

           <div className="space-y-4 text-sm font-medium">
             <div className="flex justify-between text-black"><span>Subtotal</span><span className="text-black font-bold">{formatCurrency(rawTotal, currency)}</span></div>
             <div className="flex justify-between text-black">
               <span className="flex items-center gap-2"><Truck size={14}/> Delivery ({selectedZone?.name || 'Select Zone'})</span>
               <span className="text-black font-bold">{selectedZone ? formatCurrency(deliveryFee, currency) : '—'}</span>
             </div>
             {discountVal > 0 && <div className="flex justify-between text-black"><span>Discount Applied</span><span>-{formatCurrency(discountVal, currency)}</span></div>}
             
             <div className="flex justify-between text-3xl font-black text-black pt-6 border-t border-white/10 ">
               <span>Total</span><span>{formatCurrency(total, currency)}</span>
             </div>
           </div>

           {error && <p className="text-rose-400 text-xs font-bold bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">{error}</p>}
           
           <Button type="submit" form="checkout-form" disabled={loading || items.length === 0} className="w-full h-16 text-xl font-black rounded-2xl bg-black hover:bg-[#DAA520] shadow-xl shadow-black/20 transition-all hover:-translate-y-1 border border-white/20">
             {loading ? 'INITIALISING...' : `CONFIRM & PAY ${formatCurrency(total, currency)}`}
           </Button>

           
        </div>
      </div>
    </div>
  );
}
