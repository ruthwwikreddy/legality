'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Inbox,
  Plus,
  FileSignature,
  Users,
} from 'lucide-react';
import {
  AGREEMENT_STATUS_LABELS,
  AGREEMENT_STATUSES,
  AgreementStatus,
} from '@/lib/types';

interface AgreementParty {
  name: string;
  email: string;
  status: string;
}

interface Agreement {
  id: string;
  trackingNumber: string;
  title: string;
  category: string;
  status: AgreementStatus;
  createdAt: string;
  parties: AgreementParty[];
  signatures: unknown[];
}

const CATEGORY_LABELS: Record<string, string> = {
  MOU: 'MOU',
  NDA: 'NDA',
  MSA: 'MSA',
  Employment: 'Employment',
  Vendor: 'Vendor',
  Consultancy: 'Consultancy',
  Partnership: 'Partnership',
  Other: 'Other',
};

export default function AdminAgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agreements');
      const data = await res.json();
      if (data.agreements) setAgreements(data.agreements);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const filtered = agreements.filter((a) => {
    const matchesSearch =
      !searchTerm ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Summary counts
  const total = agreements.length;
  const draftCount = agreements.filter((a) => a.status === 'DRAFT').length;
  const awaitingCount = agreements.filter((a) => a.status === 'AWAITING_SIGNATURES').length;
  const partialCount = agreements.filter((a) => a.status === 'PARTIALLY_SIGNED').length;
  const completedCount = agreements.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'FULLY_SIGNED'
  ).length;

  const summaryCards = [
    { label: 'Total', value: total, color: 'text-neutral-900', bg: 'bg-neutral-50 border-neutral-200' },
    { label: 'Draft', value: draftCount, color: 'text-neutral-600', bg: 'bg-neutral-100 border-neutral-300' },
    { label: 'Awaiting Signatures', value: awaitingCount, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    { label: 'Partially Signed', value: partialCount, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
    { label: 'Completed', value: completedCount, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            MOU &amp; Agreement Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create, track, and manage all agreements and signing workflows
          </p>
        </div>
        <Link
          href="/admin/agreements/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Agreement</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`border rounded-xl p-4 shadow-sm ${card.bg}`}
          >
            <p className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider mb-1">
              {card.label}
            </p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or tracking number..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        >
          <option value="">All Statuses</option>
          {Object.entries(AGREEMENT_STATUSES).map(([key, val]) => (
            <option key={key} value={val}>
              {AGREEMENT_STATUS_LABELS[val as AgreementStatus]?.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">
          Loading agreements...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <Inbox className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No agreements found</h3>
          <p className="text-xs text-neutral-500">
            {agreements.length === 0
              ? 'No agreements have been created yet.'
              : 'No agreements match the active filters.'}
          </p>
          {agreements.length === 0 && (
            <Link
              href="/admin/agreements/new"
              className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition"
            >
              <FileSignature className="w-3.5 h-3.5" />
              <span>Create First Agreement</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Tracking No</th>
                  <th className="px-5 py-3.5">Title</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Parties</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((agreement) => {
                  const statusStyle =
                    AGREEMENT_STATUS_LABELS[agreement.status] || {
                      label: agreement.status,
                      color: 'text-neutral-700',
                      bg: 'bg-neutral-50 border-neutral-200',
                    };

                  return (
                    <tr key={agreement.id} className="hover:bg-neutral-50/70 transition">
                      <td className="px-5 py-4">
                        <span className="font-mono text-[10px] text-neutral-500 font-bold">
                          {agreement.trackingNumber}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-neutral-900 block max-w-xs truncate">
                          {agreement.title}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          {CATEGORY_LABELS[agreement.category] ?? agreement.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-neutral-700">
                          <Users className="w-3 h-3 text-neutral-400" />
                          <span className="font-semibold">{agreement.parties?.length ?? 0}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-neutral-500 text-[11px]">
                        {new Date(agreement.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/agreements/${agreement.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
