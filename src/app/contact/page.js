'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('We have received your message. We will get back to you within 48 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#FFDA03] py-20 md:py-32 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-6 block">Get in Touch</span>
          <h1 className="text-4xl md:text-7xl font-black poppins-font uppercase tracking-tighter leading-none text-black mb-8">
            We would love <br className="hidden md:block" /> to hear from you
          </h1>
          <p className="text-sm md:text-base font-bold text-black/70 max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
            Fill the form below and our team will get back to you within 48 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-8 py-20 grid lg:grid-cols-5 gap-16 md:gap-24">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h3 className="text-xl font-black poppins-font uppercase tracking-tight mb-8 border-l-4 border-[#FFDA03] pl-6">Contact Channels</h3>
            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#FFDA03] transition-colors">
                  <Mail size={20} className="text-gray-400 group-hover:text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Support</p>
                  <a href="mailto:support@jtothelabel.com" className="text-lg font-bold text-black hover:opacity-50 transition-opacity">support@jtothelabel.com</a>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#FFDA03] transition-colors">
                  <Phone size={20} className="text-gray-400 group-hover:text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-lg font-bold text-black">+234 (0) 812 345 6789</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#FFDA03] transition-colors">
                  <MapPin size={20} className="text-gray-400 group-hover:text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Atelier</p>
                  <p className="text-lg font-bold text-black leading-relaxed">
                    Victoria Island, <br /> Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-100 border border-gray-50">
            <h3 className="text-xl font-black poppins-font uppercase tracking-tight mb-10">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-16 bg-gray-50 border border-gray-100 rounded-3xl px-6 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-16 bg-gray-50 border border-gray-100 rounded-3xl px-6 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Subject</label>
                <input 
                  type="text" 
                  placeholder="Order Inquiry, Custom Piece, etc."
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full h-16 bg-gray-50 border border-gray-100 rounded-3xl px-6 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Message</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-black text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#FFDA03] hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
                {loading ? 'Sending...' : 'Transmit Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
