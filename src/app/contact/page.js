'use client';
import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
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
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Column: Info */}
          <div className="space-y-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 block">Get in Touch</span>
              <h1 className="text-5xl md:text-7xl  mb-8">Contact Us</h1>
              <p className="text-gray-500 max-w-md leading-relaxed">
                Whether you have a question about our collections, shipping, or simply want to say hello, our team is here to assist you.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-full">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Email Us</h4>
                  <a href="mailto:support@jtothelabel.com" className="text-sm hover:text-gray-500 transition-colors">
                    support@jtothelabel.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
               
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Instagram</h4>
                  <a href="https://instagram.com/j.t.o_the_label" target="_blank" rel="noopener" className="text-sm hover:text-gray-500 transition-colors">
                    @j.t.o_the_label
                  </a>
                 
                </div>
              </div>

              
            </div>

            <div className="pt-12 border-t border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Response Time</p>
              <p className="text-xs text-gray-500">We typically respond within 24-48 business hours.</p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full bg-[#FFFCE0] border border-gray-200 px-6 py-4 rounded-xl text-sm outline-none focus:border-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full bg-[#FFFCE0] border border-gray-200 px-6 py-4 rounded-xl text-sm outline-none focus:border-black transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Inquiry about S/S 24 Collection"
                  className="w-full bg-[#FFFCE0] border border-gray-200 px-6 py-4 rounded-xl text-sm outline-none focus:border-black transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest">Message</label>
                <textarea
                  name="message"
                  required
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full bg-[#FFFCE0] border border-gray-200 px-6 py-4 rounded-xl text-sm outline-none focus:border-black transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Sending...' : (
                  <>
                    Send Message
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
