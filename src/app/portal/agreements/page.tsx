'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSignature,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { AGREEMENT_STATUS_LABELS, AgreementStatus } from '@/lib/types';

export default function ClientAgreementsPage() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
    if (!search) return true;
    return (
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.trackingNumber.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            MOUs & Executable Agreements
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Review, collaborate, and execute legally binding agreements and bilateral MOUs online
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agreement title or reference..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Agreements Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">
          Loading agreements...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <FileSignature className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No agreements found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            You do not currently have any active MOUs or contracts awaiting signature.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((agr) => {
            const statusStyle =
              AGREEMENT_STATUS_LABELS[agr.status as AgreementStatus] || {
                label: agr.status,
                color: 'text-neutral-700',
                bg: 'bg-neutral-50 border-neutral-200',
              };
            const isCompleted = agr.status === 'FULLY_SIGNED' || agr.status === 'COMPLETED';
            const totalParties = agr.parties?.length || 0;
            const signedParties =
              agr.parties?.filter((p: any) => p.status === 'SIGNED').length || 0;

            return (
              <div
                key={agr.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:border-neutral-300 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Info */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-neutral-700">
                        {agr.trackingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}
                      >
                        {statusStyle.label}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                        {agr.category?.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-950 truncate">
                      {agr.title}
                    </h3>

                    {/* Parties signing progression status */}
                    <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>Signatories Progress</span>
                        <span className="font-semibold text-neutral-800">
                          {signedParties} of {totalParties} Signed
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-neutral-900 h-full rounded-full transition-all"
                          style={{
                            width: `${(signedParties / (totalParties || 1)) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Party Pills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {agr.parties?.map((p: any) => (
                          <div
                            key={p.id}
                            className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded bg-neutral-50 border border-neutral-200"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                p.status === 'SIGNED' ? 'bg-emerald-600' : 'bg-amber-500'
                              }`}
                            />
                            <span className="font-medium text-neutral-800">{p.name}</span>
                            <span className="text-neutral-400 font-mono text-[10px]">
                              ({p.status})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                    <div className="text-left lg:text-right text-[11px] text-neutral-400">
                      Created: {new Date(agr.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <a
                          href={`/api/agreements/${agr.id}/download`}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 hover:border-neutral-900 text-xs font-semibold text-neutral-900 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Executed PDF</span>
                        </a>
                      )}

                      <Link
                        href={`/agreements/sign/${agr.secureShareToken}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm"
                      >
                        <span>{isCompleted ? 'View Execution Record' : 'Review & Sign'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

