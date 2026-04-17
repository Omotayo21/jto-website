'use client';
import { useAuthStore } from '@/store/authStore';

export default function AccountPage() {
  const { user } = useAuthStore();

  if (!user) return <div className="p-8 text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Profile</h1>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-8">
        <img 
          src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random`} 
          alt="Profile" 
          className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-sm"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name || 'Guest User'}</h2>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
