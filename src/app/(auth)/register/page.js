'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
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
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Registration failed');
      
      setUser(data.data);
      toast.success('Registration successful! Welcome to JTOtheLabel.');
      window.location.href = '/account';
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
        <p className="text-gray-500 mt-2">Sign up to get started</p>
      </div>

      {error && <div className="bg-rose-50 text-rose-600 font-medium p-4 rounded-xl text-sm mb-8 border border-rose-100">{error}</div>}

      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 text-md" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 text-md" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <Input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="h-12 text-md" />
        </div>
        <Button type="submit" disabled={loading} className="w-full h-14 text-lg mt-6 shadow-indigo-200">
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-10">
        Already have an account? <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign in</Link>
      </p>
    </div>
  );
}
