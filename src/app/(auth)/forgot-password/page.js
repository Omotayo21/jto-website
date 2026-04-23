'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success('Reset link sent to your email!');
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Check Your Email</h1>
        <p className="text-gray-500 font-bold mb-10 leading-relaxed">
          We&apos;ve sent a password reset link to <span className="text-gray-900">{email}</span>. Please check your inbox and spam folder.
        </p>
        <Link href="/login">
          <Button variant="secondary" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-none bg-gray-50">
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <Link href="/login" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors mb-10 group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
      </Link>
      
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">Forgot Password?</h1>
        <p className="text-gray-500 font-bold leading-relaxed">No worries! Enter your email and we&apos;ll send you a link to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <Input 
              required 
              type="email" 
              placeholder="e.g. john@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="h-14 pl-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold" 
            />
          </div>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95">
          {loading ? 'Sending Link...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-50 text-center">
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">JTOtheLabel Secure Auth</p>
      </div>
    </div>
  );
}
