'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
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
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Login failed');
      setUser(data.data);
      toast.success('Welcome back.');
      window.location.href = '/account';
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#FFFCE0]">
      <div className="w-full max-w-md">
        {/* Title */}
         <div className="flex justify-center mb-8 flex flex-col items-center space-y-6">
          <img src='/black.png' alt='logo' className='w-[120px] h-[80px]' />
        <h1 className="text-3xl   text-center text-black mb-12 tracking-tight">
          Log in
        </h1>
</div>
        {error && (
          <p className="text-sm text-[#DAA520] text-center mb-6 font-medium">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          {/* Email */}
          <div className="border-b border-gray-300 focus-within:border-black transition-colors">
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-gray-400 text-black"
            />
          </div>

          {/* Password */}
          <div className="border-b border-gray-300 focus-within:border-black transition-colors mt-6">
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-gray-400 text-black"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right mt-6">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-black transition-colors underline-offset-2 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#DAA520] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-400 mt-8">
          New customer?{' '}
          <Link href="/register" className="text-black font-bold hover:text-[#DAA520] transition-colors underline underline-offset-2">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

