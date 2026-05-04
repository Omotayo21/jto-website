'use client';
import { useState, useEffect } from 'react';
import { Truck, Plus, Trash, Save, Edit2, Loader2, DollarSign, Calendar, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

export default function ShippingManagementPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingZone, setEditingZone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('domestic'); // 'domestic' or 'international'
  const [formData, setFormData] = useState({
    name: '', fee: 0, feeUSD: 0, estimatedDays: '', active: true, type: 'domestic', country: ''
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

  const domesticZones = zones.filter(z => !z.type || z.type === 'domestic');
  const internationalZones = zones.filter(z => z.type === 'international');
  const displayedZones = activeTab === 'domestic' ? domesticZones : internationalZones;

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      fee: zone.fee,
      feeUSD: zone.feeUSD || 0,
      estimatedDays: zone.estimatedDays || '',
      active: zone.active,
      type: zone.type || 'domestic',
      country: zone.country || ''
    });
    setIsModalOpen(true);
  };

  const openNewZoneModal = () => {
    setEditingZone(null);
    setFormData({
      name: '', 
      fee: activeTab === 'international' ? 0 : 0, 
      feeUSD: 0, 
      estimatedDays: '', 
      active: true, 
      type: activeTab, 
      country: ''
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

  const isDomestic = formData.type === 'domestic';

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shipping Fees</h1>
          <p className="text-gray-500 font-bold mt-2">Manage delivery zones and costs</p>
        </div>
        <Button onClick={openNewZoneModal} className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-200 transition-all hover:-translate-y-1">
          <Plus className="mr-2 h-4 w-4" /> Add New Zone
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-10">
        <button
          onClick={() => setActiveTab('domestic')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
            activeTab === 'domestic'
              ? 'bg-black text-white shadow-xl shadow-gray-200'
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <MapPin size={16} /> Nigeria ({domesticZones.length})
        </button>
        <button
          onClick={() => setActiveTab('international')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
            activeTab === 'international'
              ? 'bg-black text-white shadow-xl shadow-gray-200'
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <Globe size={16} /> International ({internationalZones.length})
        </button>
      </div>

      {displayedZones.length === 0 ? (
        <div className="text-center py-20 bg-[#FFFCE0] rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            {activeTab === 'domestic' ? <MapPin size={32} className="text-gray-300" /> : <Globe size={32} className="text-gray-300" />}
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No {activeTab === 'domestic' ? 'Nigerian' : 'International'} Zones</h3>
          <p className="text-gray-400 font-medium mb-6">Click &quot;Add New Zone&quot; to create your first {activeTab} shipping zone.</p>
          <Button onClick={openNewZoneModal} className="rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest">
            <Plus className="mr-2 h-4 w-4" /> Add Zone
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedZones.map(zone => (
            <div key={zone._id} className="bg-[#FFFCE0] rounded-[2.5rem] p-8 shadow-xl shadow-gray-100 border border-gray-50 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${zone.active ? 'bg-black' : 'bg-gray-400'}`} />
              
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500 ${zone.type === 'international' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-black'}`}>
                  {zone.type === 'international' ? <Globe size={24} /> : <Truck size={24} />}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(zone)} className="p-2 text-gray-400 hover:text-black transition-colors"><Edit2 size={18}/></button>
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-1 truncate">{zone.name}</h3>
              {zone.country && (
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{zone.country}</p>
              )}
              <div className="flex items-baseline gap-2 mb-6">
                 {zone.type === 'international' ? (
                   <span className="text-3xl font-black text-black">${(zone.feeUSD || 0).toLocaleString()}</span>
                 ) : (
                   <span className="text-3xl font-black text-black">₦{zone.fee.toLocaleString()}</span>
                 )}
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
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#FFFCE0] w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
             <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
               {editingZone ? 'Edit Zone' : 'New Zone'}
             </h2>
             <p className="text-sm text-gray-400 font-bold mb-8 uppercase tracking-widest">
               {formData.type === 'international' ? '🌍 International Shipping' : '🇳🇬 Nigeria Delivery'}
             </p>
             
             <form onSubmit={handleSave} className="space-y-6">
                {/* Zone Type Toggle (only for new zones) */}
                {!editingZone && (
                  <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'domestic', country: '' })}
                      className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        formData.type === 'domestic' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <MapPin size={14} className="inline mr-1 -mt-0.5" /> Nigeria
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'international' })}
                      className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        formData.type === 'international' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Globe size={14} className="inline mr-1 -mt-0.5" /> International
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                     {isDomestic ? 'Zone Name' : 'Destination Name'}
                   </label>
                   <Input 
                      required 
                      placeholder={isDomestic ? 'e.g. Lagos Island' : 'e.g. United States'} 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-[#FFFCE0] transition-all font-bold"
                   />
                </div>

                {/* Country field for international */}
                {formData.type === 'international' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Country Code</label>
                    <Input 
                      placeholder="e.g. USA, UK, CA" 
                      value={formData.country} 
                      onChange={e => setFormData({...formData, country: e.target.value.toUpperCase()})}
                      className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-[#FFFCE0] transition-all font-bold"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  {isDomestic ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Fee (₦ NGN)</label>
                      <Input 
                          required 
                          type="number" 
                          placeholder="0" 
                          value={formData.fee} 
                          onChange={e => setFormData({...formData, fee: Number(e.target.value)})}
                          className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-[#FFFCE0] transition-all font-bold"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Fee ($ USD)</label>
                      <Input 
                          required 
                          type="number" 
                          placeholder="0" 
                          value={formData.feeUSD} 
                          onChange={e => setFormData({...formData, feeUSD: Number(e.target.value)})}
                          className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-[#FFFCE0] transition-all font-bold"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Est. Delivery</label>
                    <Input 
                        placeholder={isDomestic ? 'e.g. 1-2 days' : 'e.g. 7-14 days'} 
                        value={formData.estimatedDays} 
                        onChange={e => setFormData({...formData, estimatedDays: e.target.value})}
                        className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-[#FFFCE0] transition-all font-bold"
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
