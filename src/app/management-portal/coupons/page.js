'use client';
import { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Power, PowerOff, Loader2, Calendar, Hash, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    usageLimit: '',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) setCoupons(data.data);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Coupon created successfully');
        setShowAdd(false);
        fetchCoupons();
        setFormData({
          code: '', type: 'percentage', value: '', minOrderAmount: '', usageLimit: '',
          validFrom: new Date().toISOString().split('T')[0],
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      } else {
        toast.error(data.error || 'Failed to create coupon');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !coupon.active })
      });
      if (res.ok) {
        toast.success(`Coupon ${!coupon.active ? 'activated' : 'deactivated'}`);
        fetchCoupons();
      }
    } catch (err) {
      toast.error('Toggle failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Coupon deleted');
        fetchCoupons();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-black" size={40} /></div>;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Marketing Coupons</h1>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1 opacity-70">Manage discounts and promotions</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-gray-200">
           {showAdd ? 'Close Form' : <><Plus size={20} /> Create Coupon</>}
        </Button>
      </div>

      {showAdd && (
        <div className="bg-[#FFFCE0] p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
           <h2 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-black pl-4 uppercase tracking-tight">New Coupon Details</h2>
           <form onSubmit={handleCreate} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Promo Code</label>
                 <Input required placeholder="E.g. SUMMER25" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="h-14 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Type</label>
                 <select className="w-full h-14 px-4 rounded-xl border border-gray-100 bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (NGN)</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Value ({formData.type === 'percentage' ? '%' : 'NGN'})</label>
                 <Input required type="number" placeholder="Value" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="h-14 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Order Amount (NGN)</label>
                 <Input type="number" placeholder="0" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} className="h-14 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usage Limit (Optional)</label>
                 <Input type="number" placeholder="Unlimited" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: e.target.value})} className="h-14 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valid Until</label>
                 <Input required type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} className="h-14 rounded-xl font-bold" />
              </div>
              <div className="lg:col-span-3 pt-4">
                 <Button disabled={isSubmitting} type="submit" className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-gray-300">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Generate Coupon Code'}
                 </Button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.map((coupon) => (
          <div key={coupon._id} className={`bg-[#FFFCE0] rounded-[2.5rem] p-8 shadow-xl border-2 transition-all relative overflow-hidden group ${coupon.active ? 'border-transparent' : 'border-dashed border-gray-200 grayscale'}`}>
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-2xl opacity-20 ${coupon.active ? 'bg-gray-1000' : 'bg-gray-500'}`} />
            
            <div className="flex justify-between items-start mb-8">
               <div className={`p-4 rounded-2xl ${coupon.active ? 'bg-gray-100 text-black' : 'bg-gray-100 text-gray-400'}`}>
                  <Ticket size={24} />
               </div>
               <div className="flex gap-2">
                  <button onClick={() => toggleActive(coupon)} className={`p-3 rounded-xl transition-colors ${coupon.active ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
                    {coupon.active ? <Power size={18} /> : <PowerOff size={18} />}
                  </button>
                  <button onClick={() => handleDelete(coupon._id)} className="p-3 bg-gray-50 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">{coupon.code}</h3>
            <p className="text-black font-black text-lg mb-6">
               {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${formatCurrency(coupon.value)} OFF`}
            </p>

            <div className="space-y-3 pt-6 border-t border-gray-50">
               <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                  <DollarSign size={14} className="text-gray-300" /> Min Order: {formatCurrency(coupon.minOrderAmount)}
               </div>
               <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                  <Hash size={14} className="text-gray-300" /> Used {coupon.usageCount} / {coupon.usageLimit || '∞'} times
               </div>
               <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                  <Calendar size={14} className="text-gray-300" /> Ends {new Date(coupon.validUntil).toLocaleDateString()}
               </div>
            </div>
            
            {!coupon.active && <div className="absolute inset-0 bg-[#FFFCE0]/40 backdrop-blur-[1px] flex items-center justify-center">
                <span className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full">Inactive</span>
            </div>}
          </div>
        ))}

        {coupons.length === 0 && (
          <div className="lg:col-span-3 py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
             <Ticket size={48} className="text-gray-200 mx-auto mb-4" />
             <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active coupons found</p>
          </div>
        )}
      </div>
    </div>
  );
}
