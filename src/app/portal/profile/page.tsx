'use client';

import { useState, useEffect } from 'react';
import { User, Building, Mail, Phone, FileBadge, Edit3, Save, X, CheckCircle2 } from 'lucide-react';

export default function ClientProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    organizationName: '',
    businessType: 'Private Limited Company',
    taxId: '',
    industry: '',
    address: '',
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
        setFormData({
          fullName: data.user.fullName || '',
          phone: data.user.phone || '',
          organizationName: data.user.clientProfile?.organizationName || '',
          businessType: data.user.clientProfile?.businessType || 'Private Limited Company',
          taxId: data.user.clientProfile?.taxId || '',
          industry: data.user.clientProfile?.industry || '',
          address: data.user.clientProfile?.address || '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
      } else {
        setUser(data.user);
        setIsEditing(false);
        setFeedback('Profile successfully updated.');
        setTimeout(() => setFeedback(''), 4000);
      }
    } catch {
      setError('Network error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-neutral-500">Loading profile dossier...</div>;
  }

  if (!user) {
    return <div className="p-12 text-center text-xs text-rose-500">Unable to retrieve profile.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            Client & Enterprise Profile
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Registered corporate identity, tax identifiers, and statutory contact coordinates
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 text-xs font-semibold text-neutral-800 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xl">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{user.fullName}</h2>
            <p className="text-xs text-neutral-500 font-mono">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
              Verified Client Entity
            </span>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Organization Legal Name
                </label>
                <input
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Business Entity Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
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
                  GSTIN / PAN Tax Identifier
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Industry Sector
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Registered Office Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
                Organization Name
              </span>
              <p className="font-semibold text-neutral-900 text-sm">
                {user.clientProfile?.organizationName || 'Not specified'}
              </p>
            </div>

            <div>
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
                Business Entity Type
              </span>
              <p className="font-semibold text-neutral-900 text-sm">
                {user.clientProfile?.businessType || 'Private Limited Company'}
              </p>
            </div>

            <div>
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
                Phone Number
              </span>
              <p className="font-semibold text-neutral-900 text-sm">
                {user.phone || 'Not provided'}
              </p>
            </div>

            <div>
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
                GSTIN / PAN Tax Identifier
              </span>
              <p className="font-mono font-semibold text-neutral-900 text-sm">
                {user.clientProfile?.taxId || 'Not provided'}
              </p>
            </div>

            <div>
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
                Industry Domain
              </span>
              <p className="font-semibold text-neutral-900 text-sm">
                {user.clientProfile?.industry || 'Technology / Enterprise'}
              </p>
            </div>

            <div>
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
                Account Status
              </span>
              <p className="font-semibold text-emerald-700 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Active & Compliant</span>
              </p>
            </div>

            <div className="sm:col-span-2">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
                Registered Office Address
              </span>
              <p className="text-neutral-700 leading-relaxed">
                {user.clientProfile?.address || 'Not specified'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
