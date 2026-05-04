'use client';
import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { verifyAdminPasskey } from '@/lib/actions';

// Safe icon component helper
const Icon = ({ name, size = 20, ...props }) => {
  const LucidIcon = LucideIcons[name];
  if (!LucidIcon) return null;
  return <LucidIcon size={size} {...props} />;
};

export default function SecretGate({ children }) {
  const [passkey, setPasskey] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const checkSavedKey = async () => {
      const saved = localStorage.getItem('admin_gate_key');
      if (saved) {
        try {
          const res = await verifyAdminPasskey(saved);
          if (res.success) {
            localStorage.setItem('admin_gate_role', res.role);
            setIsAuthorized(true);
          } else {
            localStorage.removeItem('admin_gate_key');
            localStorage.removeItem('admin_gate_role');
          }
        } catch (err) {
          console.error('Initial verification failed:', err);
        }
      }
      setIsChecking(false);
    };

    checkSavedKey();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      const res = await verifyAdminPasskey(passkey);
      if (res.success) {
        localStorage.setItem('admin_gate_key', passkey);
        localStorage.setItem('admin_gate_role', res.role);
        setIsAuthorized(true);
      } else {
        setError(res.error || 'Invalid Administrative Passkey');
      }
    } catch (err) {
      setError('System verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-[110] bg-gray-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full" />
          <Icon name="Loader2" size={80} className="text-black animate-spin absolute inset-0" />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Syncing Portal</p>
      </div>
    );
  }

  if (isAuthorized) return children;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#FFFCE0] p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-gray-100 text-black rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Icon name="Lock" size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Admin Access</h1>
        <p className="text-gray-500 font-bold mb-10 leading-relaxed">Please enter your 12-character administrative passkey to gain dashboard privileges.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            type="password" 
            placeholder="Enter passkey here..." 
            value={passkey} 
            onChange={(e) => setPasskey(e.target.value)}
            className="h-14 text-center tracking-[0.5em] font-black text-xl placeholder:tracking-normal placeholder:font-bold"
          />
          {error && <p className="text-rose-500 text-sm font-bold animate-shake">{error}</p>}
          <Button type="submit" className="w-full h-14 text-lg font-black shadow-lg shadow-gray-200">
            Authorize Sessions
          </Button>
        </form>
        
        <p className="mt-8 text-[10px] text-gray-400 uppercase font-black tracking-widest leading-loose">
          Secure Environment • Encrypted Connection • System Rev: 4.1.0
        </p>
      </div>
    </div>
  );
}

