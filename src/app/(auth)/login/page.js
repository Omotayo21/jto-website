'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Login failed');
      
      // The API returns the user object in data.data
      setUser(data.data);
      toast.success('Login successful! Welcome back.');
      window.location.href = '/account';
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to your account</p>
      </div>

      {error && <div className="bg-rose-50 text-rose-600 font-medium p-4 rounded-xl text-sm mb-8 border border-rose-100">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 text-md" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 text-md" />
        </div>
        <Button type="submit" disabled={loading} className="w-full h-14 text-lg mt-6 shadow-indigo-200">
          {loading ? 'Authenticating...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-10">
        Don't have an account? <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign up</Link>
      </p>
    </div>
  );
}
