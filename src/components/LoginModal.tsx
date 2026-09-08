import React, { useState } from 'react';
import { User } from '../types.ts';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
  users: User[];
  currentUser: User | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  users,
  currentUser,
}) => {
  const [email, setEmail] = useState('rahul.mahto.1537@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your authorized corporate email');
      return;
    }
    setError(null);
    onLogin(email.trim());
    onClose();
  };

  const handleSelectDemoUser = (user: User) => {
    setEmail(user.email);
    onLogin(user.email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c4c6ce]/50 space-y-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#74777e] hover:text-[#0b1c30] p-1 rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0f2744] flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-[#89ceff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="16" y2="6" />
              <circle cx="17" cy="6" r="2" fill="#89ceff" />
              <line x1="4" y1="12" x2="19" y2="12" />
              <circle cx="20" cy="12" r="2" fill="#89ceff" />
              <line x1="4" y1="18" x2="12" y2="18" />
              <circle cx="13" cy="18" r="2" fill="#89ceff" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg text-[#0b1c30] tracking-tight">Chronos Security Gate</h2>
            <p className="text-xs text-[#44474d]">Authorized Project Portal Access</p>
          </div>
        </div>

        {/* Current status if signed in */}
        {currentUser && (
          <div className="p-3 bg-[#eff4ff] border border-[#d3e4fe] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <div className="font-bold text-xs text-[#0b1c30]">{currentUser.name}</div>
                <div className="font-mono text-[10px] text-[#216293]">{currentUser.role}</div>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-[#ecfdf5] text-[#047857] px-2 py-0.5 rounded font-bold">
              Active Session
            </span>
          </div>
        )}

        {/* Fast Switch Persona for Testing */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-mono font-bold uppercase text-[#74777e] tracking-wider">
            Quick Persona Login
          </div>
          <div className="grid grid-cols-2 gap-2">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelectDemoUser(u)}
                className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                  currentUser?.id === u.id
                    ? 'border-[#216293] bg-[#eff4ff]'
                    : 'border-[#c4c6ce]/50 hover:bg-[#f8f9ff]'
                }`}
              >
                <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-[#0b1c30] truncate">{u.name}</div>
                  <div className="font-mono text-[10px] text-[#74777e] truncate">{u.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#eff4ff]"></div>
          <span className="flex-shrink mx-3 text-[11px] text-[#74777e] font-mono uppercase">Or Enter Credentials</span>
          <div className="flex-grow border-t border-[#eff4ff]"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-2.5 bg-[#ffdad6] text-[#93000a] rounded-lg text-xs font-mono font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#74777e] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@infrastructure.gov"
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-[#c4c6ce] text-xs text-[#0b1c30] focus:outline-none focus:border-[#216293]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">Security Key / Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#74777e] absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-14 py-2 bg-white rounded-lg border border-[#c4c6ce] text-xs text-[#0b1c30] focus:outline-none focus:border-[#216293]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-[11px] font-mono text-[#216293] hover:underline"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0f2744] hover:bg-[#216293] text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authenticate & Access Site Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Security badges */}
        <div className="pt-2 border-t border-[#eff4ff] flex items-center justify-between text-[11px] text-[#74777e] font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#216293]" />
            SAML 2.0 / SSO Ready
          </span>
          <span>FIPS 140-2 Level 3 Compliant</span>
        </div>
      </div>
    </div>
  );
};
