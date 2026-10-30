import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'admin';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(initialMode);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'admin') {
      const res = storageService.claimAdmin(adminKey);
      if (res.success) {
        setSuccessMsg('Administrator access granted successfully!');
        setTimeout(() => {
          const u = storageService.getCurrentUser();
          if (u) onSuccess(u);
          onClose();
        }, 800);
      } else {
        setError(res.error || 'Invalid administrator password.');
      }
      return;
    }

    if (mode === 'login') {
      if (!email) {
        setError('Please enter your email address.');
        return;
      }
      const res = storageService.login(email, password);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Login failed.');
      }
    } else {
      if (!email || !fullName || !phone) {
        setError('Please fill in all registration fields.');
        return;
      }
      const res = storageService.register({
        email,
        full_name: fullName,
        phone,
        password
      });
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-sky-50 rounded-3xl shadow-2xl overflow-hidden border border-sky-300">
        {/* Header with Uploaded Logo Image */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition-all"
          >
            Close
          </button>

          <img
            src="/assets/aistudio/IMG_20261028_235227_fcd2bf8e.png"
            alt="AHAVA DIGITAL HUB"
            className="h-12 w-auto object-contain mx-auto mb-2 bg-sky-50/90 p-1 rounded-xl"
          />

          <h3 className="font-black text-xl">
            {mode === 'login' && 'Sign in to AHAVA DIGITAL HUB'}
            {mode === 'register' && 'Create Business Owner Account'}
            {mode === 'admin' && 'Administrator Access (/admin)'}
          </h3>
          <p className="text-xs text-sky-200 mt-1 font-semibold">
            {mode === 'login' && 'Manage your business directory profile & active adverts'}
            {mode === 'register' && 'Register your business to connect with thousands of customers'}
            {mode === 'admin' && 'Enter master password to access platform admin controls'}
          </p>
        </div>

        {/* Tab Switcher */}
        {mode !== 'admin' && (
          <div className="flex border-b border-sky-300 bg-sky-100">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-black transition-all border-b-2 ${
                mode === 'login' ? 'border-blue-950 text-blue-950 bg-sky-50' : 'border-transparent text-slate-700 hover:text-blue-950'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-black transition-all border-b-2 ${
                mode === 'register' ? 'border-blue-950 text-blue-950 bg-sky-50' : 'border-transparent text-slate-700 hover:text-blue-950'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-bold">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold">
              {successMsg}
            </div>
          )}

          {mode === 'admin' ? (
            <div>
              <label className="text-xs font-black text-blue-950 block mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter password (Chukwuyem291@)"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
              />
              <p className="text-[11px] text-slate-700 font-bold mt-2">
                Authorized access only. Use master password: <code className="bg-sky-200 px-1.5 py-0.5 rounded text-blue-950 font-mono font-black">Chukwuyem291@</code>
              </p>
            </div>
          ) : (
            <>
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Babatunde Alabi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Phone Number (Nigerian)</label>
                    <input
                      type="tel"
                      required
                      placeholder="0803 555 1234 or +234..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-black text-blue-950 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@business.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-black text-blue-950 block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-sm shadow-md transition-all active:scale-98"
          >
            {mode === 'login' && 'Sign In to Dashboard'}
            {mode === 'register' && 'Register Business Account'}
            {mode === 'admin' && 'Unlock Admin Panel'}
          </button>

          {/* Admin Setup Link */}
          <div className="pt-3 border-t border-sky-200 flex items-center justify-between text-xs text-slate-700">
            {mode === 'admin' ? (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-950 font-extrabold hover:underline"
              >
                Back to standard login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('admin')}
                className="text-blue-950 hover:underline font-black ml-auto"
              >
                Admin Portal (/admin)
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
