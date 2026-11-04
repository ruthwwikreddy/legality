'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, CheckCircle2, FileSignature } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultContent: string;
}

interface Party {
  name: string;
  email: string;
  organization: string;
  designation: string;
  role: string;
}

const CATEGORIES = [
  'MOU',
  'NDA',
  'MSA',
  'Employment',
  'Vendor',
  'Consultancy',
  'Partnership',
  'Other',
];

const emptyParty = (): Party => ({
  name: '',
  email: '',
  organization: '',
  designation: '',
  role: 'Signatory',
});

export default function NewAgreementPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('MOU');
  const [templateId, setTemplateId] = useState('');
  const [content, setContent] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [parties, setParties] = useState<Party[]>([emptyParty(), emptyParty()]);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<{ trackingNumber: string; id: string } | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates');
        const data = await res.json();
        if (data.templates) setTemplates(data.templates);
      } catch (e) {
        console.error(e);
      } finally {
        setTemplatesLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    if (!id) return;
    const tpl = templates.find((t) => t.id === id);
    if (tpl) {
      setContent(tpl.defaultContent ?? '');
      if (tpl.category) setCategory(tpl.category);
    }
  };

  const updateParty = (index: number, field: keyof Party, value: string) => {
    setParties((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addParty = () => setParties((prev) => [...prev, emptyParty()]);

  const removeParty = (index: number) => {
    if (parties.length <= 2) return;
    setParties((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Agreement title is required.';
    if (!content.trim()) errs.content = 'Agreement content is required.';
    parties.forEach((p, i) => {
      if (!p.name.trim()) errs[`party_${i}_name`] = 'Name is required.';
      if (!p.email.trim()) errs[`party_${i}_email`] = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
        errs[`party_${i}_email`] = 'Valid email is required.';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        category,
        content: content.trim(),
        parties,
      };
      if (templateId) body.templateId = templateId;
      if (effectiveDate) body.effectiveDate = new Date(effectiveDate).toISOString();
      if (expiryDate) body.expiryDate = new Date(expiryDate).toISOString();

      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ form: data.error ?? 'Failed to create agreement.' });
      } else {
        setSuccess({
          trackingNumber: data.agreement?.trackingNumber ?? '',
          id: data.agreement?.id ?? '',
        });
      }
    } catch (e) {
      console.error(e);
      setErrors({ form: 'An unexpected error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-lg font-bold text-neutral-950">Agreement Created Successfully</h2>
          <p className="text-sm text-neutral-600">
            Signing links have been generated for all parties.
          </p>
          <div className="inline-block bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-2">
            <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
              Tracking Number
            </span>
            <span className="font-mono font-bold text-neutral-900 text-sm">
              {success.trackingNumber}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href={`/admin/agreements/${success.id}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition"
            >
              <FileSignature className="w-4 h-4" />
              <span>View Agreement</span>
            </Link>
            <Link
              href="/admin/agreements"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition"
            >
              Back to Agreements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/admin/agreements"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Agreements</span>
      </Link>

      {/* Header */}
      <div className="pb-4 border-b border-neutral-200">
        <h1 className="text-xl font-bold tracking-tight text-neutral-950">Create New Agreement</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Fill in the details and add all signing parties to generate secure signing links.
        </p>
      </div>

      {errors.form && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Agreement Details
          </h2>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Agreement Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Strategic Partnership MOU — ACME Corp"
              className="w-full px-3.5 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
          </div>

          {/* Category + Template row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Use Template <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <select
                value={templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                disabled={templatesLoading}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:opacity-50"
              >
                <option value="">
                  {templatesLoading ? 'Loading templates...' : '— No template —'}
                </option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.title} ({tpl.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Effective Date <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Expiry Date <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Agreement Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the full agreement text here, or select a template above to auto-populate..."
              className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-y"
            />
            {errors.content && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.content}</p>
            )}
          </div>
        </div>

        {/* Parties */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Signing Parties
            </h2>
            <button
              type="button"
              onClick={addParty}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Party
            </button>
          </div>

          <div className="space-y-5">
            {parties.map((party, index) => (
              <div
                key={index}
                className="border border-neutral-200 rounded-xl p-4 space-y-3 bg-neutral-50/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    Party {index + 1}
                  </span>
                  {index >= 2 && (
                    <button
                      type="button"
                      onClick={() => removeParty(index)}
                      className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 font-semibold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={party.name}
                      onChange={(e) => updateParty(index, 'name', e.target.value)}
                      placeholder="e.g. Ravi Kumar"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    {errors[`party_${index}_name`] && (
                      <p className="text-[11px] text-rose-600 mt-1">
                        {errors[`party_${index}_name`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={party.email}
                      onChange={(e) => updateParty(index, 'email', e.target.value)}
                      placeholder="e.g. ravi@company.com"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    {errors[`party_${index}_email`] && (
                      <p className="text-[11px] text-rose-600 mt-1">
                        {errors[`party_${index}_email`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={party.organization}
                      onChange={(e) => updateParty(index, 'organization', e.target.value)}
                      placeholder="e.g. ACME Pvt. Ltd."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={party.designation}
                      onChange={(e) => updateParty(index, 'designation', e.target.value)}
                      placeholder="e.g. Managing Director"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">
                    Role: Signatory
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link
            href="/admin/agreements"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition disabled:opacity-60"
          >
            <FileSignature className="w-3.5 h-3.5" />
            <span>
              {submitting ? 'Creating...' : 'Create Agreement & Generate Signing Links'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
