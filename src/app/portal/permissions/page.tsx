'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  PlusCircle,
  Download,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { REQUEST_STATUS_LABELS, RequestStatus } from '@/lib/types';

export default function ClientPermissionsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/requests?category=PERMISSIONS_APPROVALS')
      .then((res) => res.json())
      .then((data) => {
        if (data.requests) setRequests(data.requests);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            Permissions, Licences & Clearances Tracking
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor statutory applications, required authority information, and official issued certificates
          </p>
        </div>

        <Link
          href="/portal/requests/new?cat=PERMISSIONS_APPROVALS"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Licence Application</span>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Total Applications</span>
          <p className="text-2xl font-bold text-neutral-900">{requests.length}</p>
        </div>
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Under Review</span>
          <p className="text-2xl font-bold text-indigo-700">
            {requests.filter((r) => r.status === 'UNDER_REVIEW' || r.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Issued Approvals</span>
          <p className="text-2xl font-bold text-emerald-700">
            {requests.filter((r) => r.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Permission Requests List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">
          Loading permissions and licence matters...
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No licence matters active</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Submit a request for industrial clearance, pollution consent, municipal licence, or factory permits.
          </p>
          <Link
            href="/portal/requests/new?cat=PERMISSIONS_APPROVALS"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold"
          >
            Apply for Permission
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const statusStyle =
              REQUEST_STATUS_LABELS[req.status as RequestStatus] || {
                label: req.status,
                color: 'text-neutral-700',
                bg: 'bg-neutral-50 border-neutral-200',
              };
            let parsed: any = null;
            try {
              if (req.dynamicData) parsed = JSON.parse(req.dynamicData);
            } catch {}

            return (
              <div
                key={req.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:border-neutral-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-neutral-800">
                        {req.trackingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}
                      >
                        {statusStyle.label}
                      </span>
                      {parsed?.authorityName && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          {parsed.authorityName}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/portal/requests/${req.id}`}
                      className="text-base font-bold text-neutral-950 hover:text-neutral-700 block"
                    >
                      {req.title}
                    </Link>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {req.description}
                    </p>

                    {parsed?.siteLocation && (
                      <div className="text-[11px] text-neutral-500 font-mono">
                        Location: {parsed.siteLocation}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <Link
                      href={`/portal/requests/${req.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-900 text-xs font-semibold text-neutral-900 transition"
                    >
                      <span>Track Progress</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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

