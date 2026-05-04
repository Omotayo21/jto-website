'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Registration failed');
      setUser(data.data);
      toast.success('Welcome to JTOtheLabel.');
      window.location.href = '/account';
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
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
        <h1 className="text-3xl  text-center text-black mb-12 tracking-tight">
          Create Account
        </h1>
</div>
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-12 font-medium">
          Join the JTOtheLabel Community
        </p>

        {error && (
          <p className="text-sm text-[#DAA520] text-center mb-6 font-medium">{error}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          {/* Name */}
          <div className="border-b border-gray-300 focus-within:border-black transition-colors">
            <input
              required
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-gray-400 text-black"
            />
          </div>

          {/* Email */}
          <div className="border-b border-gray-300 focus-within:border-black transition-colors mt-6">
            <input
              required
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-gray-400 text-black"
            />
          </div>

          {/* Password */}
          <div className="border-b border-gray-300 focus-within:border-black transition-colors mt-6">
            <input
              required
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-gray-400 text-black"
            />
          </div>

          {/* Submit */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#DAA520] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-black font-bold hover:text-[#DAA520] transition-colors underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

