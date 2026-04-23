'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        toast.success('Password reset successful!');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        toast.error(data.error || 'Failed to reset password');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Password Reset!</h1>
        <p className="text-gray-500 font-bold mb-10 leading-relaxed">
          Your password has been successfully updated. Redirecting you to login in a few seconds...
        </p>
        <Link href="/login">
          <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100">
            Login Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="mb-10">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
          <Lock size={30} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">Set New Password</h1>
        <p className="text-gray-500 font-bold leading-relaxed">Create a strong password that you haven&apos;t used before.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">New Password</label>
          <Input 
            required 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirm New Password</label>
          <Input 
            required 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold" 
          />
        </div>
        
        <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95">
          {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
        </Button>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-50 text-center">
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Secure Session Active</p>
      </div>
    </div>
  );
}
