'use client';
import { useState, useEffect } from 'react';
import { Truck, Plus, Trash, Save, Edit2, Loader2, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

export default function ShippingManagementPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingZone, setEditingZone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', fee: 0, estimatedDays: '', active: true
  });

  const fetchZones = async () => {
    try {
      const res = await fetch('/api/delivery-zones');
      const data = await res.json();
      if (data.success) {
        setZones(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch shipping zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      fee: zone.fee,
      estimatedDays: zone.estimatedDays || '',
      active: zone.active
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingZone ? `/api/delivery-zones/${editingZone._id}` : '/api/delivery-zones';
      const method = editingZone ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editingZone ? 'Zone updated' : 'Zone created');
        setEditingZone(null);
        setIsModalOpen(false);
        fetchZones();
      } else {
        toast.error(data.error || 'Failed to save zone');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading && zones.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shipping Fees</h1>
          <p className="text-gray-500 font-bold mt-2">Manage delivery zones and costs</p>
        </div>
        <Button onClick={() => { setEditingZone(null); setFormData({ name: '', fee: 0, estimatedDays: '', active: true }); setIsModalOpen(true); }} className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-200 transition-all hover:-translate-y-1">
          <Plus className="mr-2 h-4 w-4" /> Add New Zone
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {zones.map(zone => (
          <div key={zone._id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-100 border border-gray-50 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${zone.active ? 'bg-black' : 'bg-gray-400'}`} />
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-gray-100 text-black rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <Truck size={24} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(zone)} className="p-2 text-gray-400 hover:text-black transition-colors"><Edit2 size={18}/></button>
              </div>
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{zone.name}</h3>
            <div className="flex items-baseline gap-2 mb-6">
               <span className="text-3xl font-black text-black">NGN {zone.fee.toLocaleString()}</span>
               <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Fixed Fee</span>
            </div>

            <div className="space-y-3 mb-8">
               <div className="flex items-center gap-3 text-sm font-bold text-gray-500 bg-gray-50 p-3 rounded-xl">
                  <Calendar size={16} className="text-gray-400" />
                  {zone.estimatedDays || 'No estimate set'}
               </div>
               <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${zone.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">{zone.active ? 'Active' : 'Inactive'}</span>
               </div>
            </div>

            <Button onClick={() => handleEdit(zone)} variant="secondary" className="w-full rounded-xl bg-gray-50 hover:bg-gray-100 border-none font-bold text-black">Update Settings</Button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
             <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">{editingZone ? 'Edit Zone' : 'New Zone'}</h2>
             
             <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Zone Name</label>
                   <Input 
                      required 
                      placeholder="e.g. Lagos Island" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold"
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Fee (NGN)</label>
                    <Input 
                        required 
                        type="number" 
                        placeholder="0" 
                        value={formData.fee} 
                        onChange={e => setFormData({...formData, fee: Number(e.target.value)})}
                        className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Est. Delivery</label>
                    <Input 
                        placeholder="e.g. 1-2 days" 
                        value={formData.estimatedDays} 
                        onChange={e => setFormData({...formData, estimatedDays: e.target.value})}
                        className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                   <input 
                      type="checkbox" 
                      id="zone-active"
                      checked={formData.active}
                      onChange={e => setFormData({...formData, active: e.target.checked})}
                      className="w-5 h-5 rounded-lg accent-black"
                   />
                   <label htmlFor="zone-active" className="font-bold text-gray-700">Active and visible to customers</label>
                </div>

                <div className="pt-6 flex gap-3">
                   <Button type="submit" disabled={loading} className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-200 transition-all active:scale-95">
                      {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" size={16}/> Save Changes</>}
                   </Button>
                   <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="h-14 px-8 rounded-2xl border-none bg-gray-50 font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
