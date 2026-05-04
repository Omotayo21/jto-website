'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Plus, Trash, Save, ArrowLeft, Video, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function AdminProductForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [role, setRole] = useState(null);
  useEffect(() => {
    setRole(localStorage.getItem('admin_gate_role') || 'admin');
  }, []);

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        // Migrate legacy single category to categories array
        categories: initialData.categories?.length > 0
          ? initialData.categories
          : (initialData.category ? [initialData.category] : []),
        costPriceUSD: initialData.costPriceUSD || 0,
      };
    }
    return {
      name: '',
      slug: '',
      description: '',
      price: 0,
      priceUSD: 0,
      costPrice: 0,
      costPriceUSD: 0,
      categories: [],
      category: '',
      media: [],
      variants: { sizes: [], colors: [] },
      inventory: {},
      status: 'active',
    };
  });

  const isContentManager = role === 'content';
  const isFinanceManager = role === 'finance';
  const isStockCoordinator = role === 'stock';
  const isAdmin = role === 'admin';

  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newSize, setNewSize] = useState('');
  const [totalStock, setTotalStock] = useState(() => {
    if (!initialData?.inventory) return 0;
    return initialData.inventory.total || 
           (typeof initialData.inventory.get === 'function' ? initialData.inventory.get('total') : initialData.inventory['total']) || 
           0;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FASHION_CATEGORIES = [
    { label: 'Dresses', value: 'dresses' },
    { label: 'Tops & Blouses', value: 'tops' },
    { label: 'Jackets & Coats', value: 'jackets' },
    { label: 'Sets & Co-ords', value: 'sets' },
    { label: 'Skirts', value: 'skirts' },
    { label: 'Trousers & Pants', value: 'trousers' },
    { label: 'Shorts', value: 'shorts' },
    { label: 'T-Shirts', value: 'tshirts' },
    { label: 'Jumpsuits & Playsuits', value: 'jumpsuits' },
    { label: 'Swimwear & Resort', value: 'swimwear' },
    { label: 'Kids', value: 'kids' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Bridal & Occasion', value: 'bridal' },
    { label: 'Loungewear', value: 'loungewear' },
    { label: 'Work Wear', value: 'workwear' },
  ];

  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const toggleCategory = (catValue) => {
    setFormData(prev => {
      const cats = prev.categories || [];
      if (cats.includes(catValue)) {
        return { ...prev, categories: cats.filter(c => c !== catValue) };
      } else {
        return { ...prev, categories: [...cats, catValue] };
      }
    });
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${type}...`);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          media: [...prev.media, { 
            url: data.data.url, 
            type: data.data.type, 
            publicId: data.data.publicId,
            order: prev.media.length 
          }]
        }));
        toast.success(`${type} uploaded successfully`, { id: toastId });
      } else {
        toast.error(data.error || 'Upload failed', { id: toastId });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.', { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = null; // Reset input
    }
  };

  const addMedia = (type) => {
    if (type === 'video') {
      videoInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
  };

  const removeMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const addColor = () => {
    if (!newColor.name) return;
    setFormData(prev => ({
      ...prev,
      variants: { ...prev.variants, colors: [...prev.variants.colors, newColor] }
    }));
    setNewColor({ name: '', hex: '#000000' });
  };

  const addSize = () => {
    if (!newSize) return;
    setFormData(prev => ({
      ...prev,
      variants: { ...prev.variants, sizes: [...prev.variants.sizes, newSize] }
    }));
    setNewSize('');
  };

  const removeVariant = (type, index) => {
    setFormData(prev => ({
      ...prev,
      variants: { ...prev.variants, [type]: prev.variants[type].filter((_, i) => i !== index) }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate variants if needed
      if (formData.variants.sizes.length === 0) {
        toast.error('Please add at least one size variant');
        setIsSubmitting(false);
        return;
      }

      if (formData.categories.length === 0) {
        toast.error('Please select at least one category');
        setIsSubmitting(false);
        return;
      }

      // Ensure inventory is updated with the total stock without wiping variants
      const finalFormData = {
        ...formData,
        // Set legacy category to first selected category for backward compat
        category: formData.categories[0] || '',
        inventory: { 
          ...(initialData?.inventory || {}), 
          total: Number(totalStock) 
        }
      };

      const res = await fetch(isEdit ? `/api/products/${initialData._id}` : '/api/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Product saved successfully');
        router.push('/management-portal/products');
      } else {
        toast.error(data.error || 'Failed to save product');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-20">
      <div className="flex justify-between items-center bg-[#FFFCE0] p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-20 z-20">
        <div className="flex items-center gap-4">
          <Link href="/management-portal/products" className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
        <Button type="submit" disabled={isSubmitting || isUploading} className="px-8 h-14 rounded-2xl font-black shadow-xl shadow-gray-200 flex gap-2 disabled:opacity-50">
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
          {isEdit ? (isSubmitting ? 'Updating...' : 'Update Changes') : (isSubmitting ? 'Publishing...' : 'Publish Product')}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Basic Info & Media */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-[#FFFCE0] p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-black pl-4 uppercase tracking-tight">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Product Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Premium Tech Windbreaker" className="h-14 font-bold" required />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Slug (URL)</label>
                  <Input name="slug" value={formData.slug} onChange={handleChange} placeholder="tech-windbreaker" className="h-14 font-bold" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full h-14 rounded-2xl border-gray-200 focus:border-black focus:ring-black font-bold px-4 bg-gray-50">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Multi-Category Selection */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                  Categories <span className="text-gray-300">(select one or more)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {FASHION_CATEGORIES.map(cat => {
                    const isSelected = (formData.categories || []).includes(cat.value);
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => toggleCategory(cat.value)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                          isSelected
                            ? 'bg-black text-white border-black'
                            : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
                {(formData.categories || []).length > 0 && (
                  <p className="text-[10px] text-gray-400 mt-2 font-medium ">
                    Selected: {formData.categories.map(c => FASHION_CATEGORIES.find(fc => fc.value === c)?.label || c).join(', ')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={5} 
                  className="w-full rounded-3xl border-gray-200 focus:border-black focus:ring-black font-medium p-6 bg-gray-50"
                  placeholder="Detailed product story and specifications..."
                />
              </div>
            </div>
          </section>

          <section className="bg-[#FFFCE0] p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-gray-900 border-l-4 border-black pl-4 uppercase tracking-tight">Media Gallery</h2>
                <div className="flex gap-3">
                  <input 
                    type="file" 
                    ref={imageInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'image')}
                  />
                  <input 
                    type="file" 
                    ref={videoInputRef} 
                    className="hidden" 
                    accept="video/*" 
                    onChange={(e) => handleFileUpload(e, 'video')}
                  />
                  
                  <button 
                    type="button" 
                    disabled={isUploading}
                    onClick={() => addMedia('image')} 
                    className="p-3 bg-gray-50 text-black rounded-xl hover:bg-gray-100 border border-gray-100 transition-all flex items-center gap-2 font-bold text-xs disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={16}/> : <Plus size={16}/>} Add Image
                  </button>
                  <button 
                    type="button" 
                    disabled={isUploading}
                    onClick={() => addMedia('video')} 
                    className="p-3 bg-gray-50 text-black rounded-xl hover:bg-gray-100 border border-gray-100 transition-all flex items-center gap-2 font-bold text-xs disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={16}/> : <Plus size={16}/>} Add Video
                  </button>
                </div>
              </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {formData.media.map((item, idx) => (
                  <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden border border-gray-200 group shadow-sm bg-gray-50">
                    {item.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <Video className="text-white opacity-50" size={32} />
                        <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-30" muted />
                      </div>
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover" alt="Media preview" />
                    )}
                    <button 
                      type="button" 
                      onClick={() => removeMedia(idx)}
                      className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-rose-200"
                    >
                      <Trash size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
                      {item.type} 0{idx + 1}
                    </div>
                  </div>
                ))}
                {formData.media.length === 0 && (
                  <div className="col-span-full border-2 border-dashed border-gray-100 p-12 text-center rounded-[2rem] flex flex-col items-center gap-4">
                    <Camera className="text-gray-300" size={48} />
                    <p className="text-gray-400 font-bold max-w-xs">Upload front/back views and a cinematic showcase video.</p>
                  </div>
                )}
             </div>
          </section>
        </div>

        {/* Right Column: Pricing & Inventory */}
        {(isAdmin || isFinanceManager || isStockCoordinator) && (
          <div className="space-y-10">
            {(isAdmin || isFinanceManager) && (
              <section className="bg-[#FFFCE0] p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-emerald-600 pl-4 uppercase tracking-tight">Pricing & Costing</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Price (₦ NGN)</label>
                      <Input type="number" name="price" value={formData.price} onChange={handleChange} className="h-14 font-black text-black" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Price ($ USD)</label>
                      <Input type="number" name="priceUSD" value={formData.priceUSD} onChange={handleChange} className="h-14 font-black text-black" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-50 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 text-rose-500">Cost per Item (₦ NGN)</label>
                        <Input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} className="h-14 font-black text-rose-600 bg-rose-50/30 border-rose-100" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 text-rose-500">Cost per Item ($ USD)</label>
                        <Input type="number" name="costPriceUSD" value={formData.costPriceUSD} onChange={handleChange} className="h-14 font-black text-rose-600 bg-rose-50/30 border-rose-100" />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium ">* Cost prices are only visible to Admin and Finance roles.</p>
                  </div>
                </div>
              </section>
            )}

          <section className="bg-[#FFFCE0] p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
             <h2 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-amber-600 pl-4 uppercase tracking-tight">Variants</h2>
             <div className="space-y-8">
                {/* Colors */}
                <div>
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Available Colors</label>
                   <div className="flex flex-wrap gap-2 mb-4">
                      {formData.variants.colors.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 group">
                           <div className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: c.hex }} />
                           <span className="text-xs font-bold text-gray-700">{c.name}</span>
                           <button type="button" onClick={() => removeVariant('colors', i)} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><Trash size={12}/></button>
                        </div>
                      ))}
                   </div>
                   <div className="flex gap-2">
                     <Input placeholder="Color Name" value={newColor.name} onChange={e => setNewColor({...newColor, name: e.target.value})} className="h-10 text-xs font-medium" />
                     <input type="color" value={newColor.hex} onChange={e => setNewColor({...newColor, hex: e.target.value})} className="h-10 w-10 shrink-0 p-1 bg-[#FFFCE0] border border-gray-200 rounded-lg cursor-pointer" />
                     <button type="button" onClick={addColor} className="p-2 bg-black text-white rounded-lg"><Plus size={16}/></button>
                   </div>
                </div>

                {/* Sizes */}
                <div>
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Available Sizes</label>
                   <div className="flex flex-wrap gap-2 mb-4">
                      {formData.variants.sizes.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 group">
                           <span className="text-xs font-black text-black">{s}</span>
                           <button type="button" onClick={() => removeVariant('sizes', i)} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><Trash size={12}/></button>
                        </div>
                      ))}
                   </div>
                   <div className="flex gap-2">
                     <Input placeholder="e.g. XL, 42" value={newSize} onChange={e => setNewSize(e.target.value.toUpperCase())} className="h-10 text-xs font-medium" />
                     <button type="button" onClick={addSize} className="p-2 bg-black text-white rounded-lg"><Plus size={16}/></button>
                   </div>
                </div>
             </div>
          </section>

            {(isAdmin || isStockCoordinator) && (
              <section className="bg-[#FFFCE0] p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-black pl-4 uppercase tracking-tight">Stock Management</h2>
                <div className="space-y-6">
                   <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Available Quantity</label>
                      <Input 
                        type="number" 
                        value={totalStock} 
                        onChange={e => setTotalStock(e.target.value)} 
                        placeholder="e.g. 100" 
                        className="h-14 font-black text-black" 
                      />
                   </div>
                   <div className="flex gap-4">
                      <button type="button" onClick={() => setFormData({...formData, status: 'active'})} className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${formData.status === 'active' ? 'bg-gray-100 border-black text-black' : 'bg-gray-50 border-transparent text-gray-400'}`}>Show on Shop</button>
                      <button type="button" onClick={() => setFormData({...formData, status: 'draft'})} className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${formData.status === 'draft' ? 'bg-rose-50 border-rose-600 text-rose-600' : 'bg-gray-50 border-transparent text-gray-400'}`}>Keep in Draft</button>
                   </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
