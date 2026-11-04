'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Copy,
  CheckCheck,
  Edit3,
  X,
  Save,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { AGREEMENT_STATUS_LABELS, AgreementStatus } from '@/lib/types';

interface Signature {
  id: string;
  signedAt: string;
  partyId: string;
}

interface Party {
  id: string;
  name: string;
  email: string;
  organization: string;
  designation: string;
  role: string;
  status: string;
  viewToken: string;
  signingOrder: number;
  signature?: Signature | null;
}

interface Agreement {
  id: string;
  trackingNumber: string;
  title: string;
  category: string;
  status: AgreementStatus;
  content: string;
  effectiveDate: string | null;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
  secureShareToken: string;
  createdBy?: {
    fullName: string;
    email: string;
  };
  parties: Party[];
  signatures: Signature[];
}

const AGREEMENT_STATUS_OPTIONS: AgreementStatus[] = [
  'DRAFT',
  'SENT_FOR_REVIEW',
  'AWAITING_SIGNATURES',
  'PARTIALLY_SIGNED',
  'FULLY_SIGNED',
  'COMPLETED',
  'CANCELLED',
];

const PARTY_STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: 'text-neutral-600', bg: 'bg-neutral-100 border-neutral-300' },
  VIEWED: { label: 'Viewed', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  REVIEWED: { label: 'Reviewed', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  SIGNED: { label: 'Signed', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  DECLINED: { label: 'Declined', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
};

function CopyField({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 min-w-0">
      {label && (
        <span className="text-[10px] font-semibold text-neutral-500 uppercase whitespace-nowrap">
          {label}
        </span>
      )}
      <span className="font-mono text-[11px] text-neutral-700 truncate flex-1">{value}</span>
      <button
        onClick={handleCopy}
        title="Copy to clipboard"
        className="flex-shrink-0 p-1 rounded hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition"
      >
        {copied ? (
          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

export default function AdminAgreementDetailPage() {
  const params = useParams();
  const agreementId = params.id as string;

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  // Status update
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Content edit
  const [editingContent, setEditingContent] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [contentSaving, setContentSaving] = useState(false);

  const fetchAgreement = async () => {
    try {
      const res = await fetch(`/api/agreements/${agreementId}`);
      const data = await res.json();
      if (data.agreement) {
        setAgreement(data.agreement);
        setNewStatus(data.agreement.status);
        setEditedContent(data.agreement.content ?? '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreementId]);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus || newStatus === agreement?.status) return;
    setStatusUpdating(true);
    setError('');
    try {
      const res = await fetch(`/api/agreements/${agreementId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Status update failed.');
      } else {
        showFeedback('Status updated successfully.');
        fetchAgreement();
      }
    } catch (e) {
      console.error(e);
      setError('Status update failed.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleContentSave = async () => {
    setContentSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/agreements/${agreementId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Content save failed.');
      } else {
        showFeedback('Agreement content saved.');
        setEditingContent(false);
        fetchAgreement();
      }
    } catch (e) {
      console.error(e);
      setError('Content save failed.');
    } finally {
      setContentSaving(false);
    }
  };

  const getOrigin = () => {
    if (typeof window !== 'undefined') return window.location.origin;
    return '';
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-neutral-500">
        Loading agreement details...
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="p-12 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto" />
        <p className="text-sm font-semibold text-neutral-900">Agreement not found.</p>
        <Link
          href="/admin/agreements"
          className="text-xs underline font-semibold text-neutral-900"
        >
          Back to agreements
        </Link>
      </div>
    );
  }

  const statusStyle =
    AGREEMENT_STATUS_LABELS[agreement.status] ?? {
      label: agreement.status,
      color: 'text-neutral-700',
      bg: 'bg-neutral-50 border-neutral-200',
    };

  const origin = getOrigin();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/agreements"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Agreements</span>
      </Link>

      {/* Feedback / Error banners */}
      {feedback && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {feedback}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* ── Agreement Header ── */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-neutral-800">
                {agreement.trackingNumber}
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                {agreement.category}
              </span>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}
              >
                {statusStyle.label}
              </span>
            </div>
            <h1 className="text-xl font-bold text-neutral-950 leading-tight">
              {agreement.title}
            </h1>
            {agreement.createdBy && (
              <p className="text-xs text-neutral-500">
                Created by{' '}
                <span className="font-semibold text-neutral-800">
                  {agreement.createdBy.fullName}
                </span>
              </p>
            )}
          </div>

          <a
            href={`/api/agreements/${agreement.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </a>
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-neutral-100">
          {[
            {
              label: 'Created',
              value: new Date(agreement.createdAt).toLocaleDateString(),
            },
            {
              label: 'Last Updated',
              value: new Date(agreement.updatedAt).toLocaleDateString(),
            },
            {
              label: 'Effective Date',
              value: agreement.effectiveDate
                ? new Date(agreement.effectiveDate).toLocaleDateString()
                : '—',
            },
            {
              label: 'Expiry Date',
              value: agreement.expiryDate
                ? new Date(agreement.expiryDate).toLocaleDateString()
                : '—',
            },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] uppercase font-semibold text-neutral-400 mb-0.5">
                {item.label}
              </p>
              <p className="text-xs font-semibold text-neutral-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Status Update + Content ── (Two columns on large) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Status Update */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Update Status
          </h3>
          <form onSubmit={handleStatusUpdate} className="space-y-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              {AGREEMENT_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {AGREEMENT_STATUS_LABELS[s]?.label ?? s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={statusUpdating || newStatus === agreement.status}
              className="w-full py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 transition"
            >
              {statusUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </form>
        </div>

        {/* Right: Agreement Content */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Agreement Content
            </h3>
            {!editingContent ? (
              <button
                onClick={() => {
                  setEditedContent(agreement.content ?? '');
                  setEditingContent(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Content
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingContent(false)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleContentSave}
                  disabled={contentSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  {contentSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {editingContent ? (
            <textarea
              rows={16}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-y"
            />
          ) : (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-[400px] overflow-y-auto">
              <pre className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap font-sans">
                {agreement.content || (
                  <span className="text-neutral-400 italic">No content available.</span>
                )}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* ── Parties & Signing Status ── */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Parties &amp; Signing Status
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Organization</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Party Status</th>
                <th className="px-5 py-3.5">Signature</th>
                <th className="px-5 py-3.5">Signing Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {agreement.parties.map((party, idx) => {
                const partyStatusStyle =
                  PARTY_STATUS_STYLES[party.status] ?? PARTY_STATUS_STYLES.PENDING;
                const signingUrl = `${origin}/agreements/sign/${party.viewToken}`;

                // Find matching signature
                const sig = agreement.signatures.find((s) => s.partyId === party.id);

                return (
                  <tr key={party.id} className="hover:bg-neutral-50/60 transition">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-neutral-500 text-[11px]">
                        #{party.signingOrder ?? idx + 1}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-neutral-900">{party.name}</span>
                      {party.designation && (
                        <span className="block text-[10px] text-neutral-400">
                          {party.designation}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] text-neutral-600">{party.email}</span>
                    </td>
                    <td className="px-5 py-4 text-neutral-700">
                      {party.organization || <span className="text-neutral-400">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {party.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${partyStatusStyle.bg} ${partyStatusStyle.color}`}
                      >
                        {partyStatusStyle.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {sig ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Signed</span>
                          <span className="text-[10px] text-neutral-400 font-normal ml-1">
                            {new Date(sig.signedAt).toLocaleDateString()}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-neutral-400 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <CopyField value={signingUrl} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Share Links ── */}
      {agreement.secureShareToken && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Shared Access Link
          </h3>
          <p className="text-xs text-neutral-500">
            Anyone with this link can view and sign the agreement (depending on their party entry).
          </p>
          <CopyField
            value={`${origin}/agreements/sign/${agreement.secureShareToken}`}
            label="Shared Link"
          />
        </div>
      )}
    </div>
  );
}
