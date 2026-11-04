'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, ArrowRight, Shield, Briefcase, User, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to sign in');
      } else {
        router.push(data.redirectTo || '/portal');
        router.refresh();
      }
    } catch {
      setError('An unexpected network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleKey: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleKey }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(data.redirectTo);
        router.refresh();
      } else {
        setError(data.error || 'Failed to sign in as demo user');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfc]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="inline-flex w-12 h-12 rounded-xl bg-neutral-900 text-white items-center justify-center mb-3 shadow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              Sign in to LEGALITY
            </h2>
            <p className="mt-1 text-xs text-neutral-600">
              Access your client portal, active legal requests, or admin console
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Quick Demo Switcher Card for instant evaluation */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Instant Demo Account Sign-In:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('client1')}
                className="p-2 bg-white rounded border border-amber-200 text-neutral-800 hover:border-neutral-900 transition text-left flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate font-medium">Client (TechCorp)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('client2')}
                className="p-2 bg-white rounded border border-amber-200 text-neutral-800 hover:border-neutral-900 transition text-left flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate font-medium">Client (Innovate)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('counsel')}
                className="p-2 bg-white rounded border border-amber-200 text-neutral-800 hover:border-neutral-900 transition text-left flex items-center gap-2"
              >
                <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate font-medium">Senior Counsel</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 bg-white rounded border border-amber-200 text-neutral-800 hover:border-neutral-900 transition text-left flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate font-medium">Managing Admin</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-7 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-neutral-100 text-center text-xs text-neutral-600">
              New to LEGALITY?{' '}
              <Link href="/register" className="font-semibold text-neutral-900 underline hover:text-neutral-700">
                Register Client Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

