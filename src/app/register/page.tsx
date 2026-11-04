'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    organizationName: '',
    businessType: 'Private Limited Company',
    taxId: '',
    industry: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/portal');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfc]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <div className="inline-flex w-12 h-12 rounded-xl bg-neutral-900 text-white items-center justify-center mb-3 shadow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              Create Client Account
            </h2>
            <p className="mt-1 text-xs text-neutral-600">
              Register your organization to submit legal requests, upload documents, and execute agreements
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Primary Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Vikramaditya Rao"
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Official Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@organization.com"
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    name="password"
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="border-b border-neutral-100 pt-3 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Entity & Organization Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Entity / Organization Name
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="e.g. Acme Technologies Pvt Ltd"
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Business Entity Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                  >
                    <option value="Private Limited Company">Private Limited Company</option>
                    <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                    <option value="Public Limited Company">Public Limited Company</option>
                    <option value="Partnership Firm">Partnership Firm</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Individual / Professional">Individual / Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    GSTIN / PAN Tax ID
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="e.g. 29ABCDE1234F1Z5"
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Technology, Healthcare, Manufacturing"
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Registered Office Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, City, State, PIN"
                  className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{loading ? 'Creating Client Account...' : 'Complete Registration'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
              <span>Already registered with LEGALITY?</span>
              <Link href="/login" className="font-semibold text-neutral-900 underline hover:text-neutral-700">
                Sign In to Portal
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

