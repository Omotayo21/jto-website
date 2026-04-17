'use client';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
    try {
      await fetch(`/api/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchUsers();
    } catch {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading Users...</div>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">User Management</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold tracking-wider">
                <th className="p-5 pl-8 border-b border-gray-100">User</th>
                <th className="p-5 border-b border-gray-100">Role</th>
                <th className="p-5 border-b border-gray-100">Status</th>
                <th className="p-5 border-b border-gray-100">Joined</th>
                <th className="p-5 pr-8 border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                 <tr key={user.uid} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                   <td className="p-5 pl-8">
                     <div className="flex items-center gap-4">
                       <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} className="w-12 h-12 rounded-full border border-gray-200 shadow-sm" />
                       <div>
                         <p className="font-bold text-gray-900">{user.displayName || 'Guest User'}</p>
                         <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                       </div>
                     </div>
                   </td>
                   <td className="p-5 text-indigo-600 font-bold capitalize">{user.role || 'user'}</td>
                   <td className="p-5">
                      <Badge variant={user.status === 'banned' ? 'danger' : 'success'} className="uppercase tracking-widest text-[10px] px-2 py-1">
                        {user.status || 'active'}
                      </Badge>
                   </td>
                   <td className="p-5 text-gray-500 text-sm font-medium whitespace-nowrap">{new Date(user.creationTime).toLocaleDateString()}</td>
                   <td className="p-5 pr-8 text-right">
                     {user.role !== 'admin' && (
                       <Button 
                         variant={user.status === 'banned' ? 'secondary' : 'danger'}
                         size="sm"
                         onClick={() => toggleStatus(user.uid, user.status)}
                         className="font-bold shadow-none"
                       >
                         {user.status === 'banned' ? 'Unban' : 'Ban Access'}
                       </Button>
                     )}
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
