'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  Clock,
  ArrowRight,
  User,
} from 'lucide-react';
import {
  REQUEST_STATUS_LABELS,
  SERVICE_CATEGORY_LABELS,
  SERVICE_CATEGORIES,
  RequestStatus,
  ServiceCategory,
} from '@/lib/types';

export default function ClientRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/requests?${params.toString()}`);
      const data = await res.json();
      if (data.requests) setRequests(data.requests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            My Legal Service Requests
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Track progress, counsel assignments, and status updates across all submitted matters
          </p>
        </div>

        <Link
          href="/portal/requests/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Service Request</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, tracking reference, or description..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="">All Service Categories</option>
            {Object.entries(SERVICE_CATEGORIES).map(([key, val]) => (
              <option key={key} value={val}>
                {SERVICE_CATEGORY_LABELS[val as ServiceCategory]?.label || val}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="AWAITING_CLIENT_INFO">Awaiting Client Info</option>
            <option value="AWAITING_APPROVAL">Awaiting Approval</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Request List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">
          Loading your legal requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No requests found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {statusFilter || categoryFilter || searchTerm
              ? 'No service requests matched your active filters.'
              : 'You have not submitted any service requests yet.'}
          </p>
          <Link
            href="/portal/requests/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold"
          >
            Create New Request
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const statusStyle =
              REQUEST_STATUS_LABELS[req.status as RequestStatus] || {
                label: req.status,
                color: 'text-neutral-700',
                bg: 'bg-neutral-50 border-neutral-200',
              };
            const catLabel =
              SERVICE_CATEGORY_LABELS[req.category as ServiceCategory]?.label || req.category;
            const assignedStaff = req.assignments?.[0]?.employee;
            const latestUpdate = req.updates?.[0];

            return (
              <div
                key={req.id}
                className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-neutral-700">
                        {req.trackingNumber}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {catLabel}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}
                      >
                        {statusStyle.label}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-50 text-neutral-500">
                        {req.priority} PRIORITY
                      </span>
                    </div>

                    <Link
                      href={`/portal/requests/${req.id}`}
                      className="text-base font-bold text-neutral-900 hover:text-neutral-700 transition block truncate"
                    >
                      {req.title}
                    </Link>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {req.description}
                    </p>

                    {latestUpdate && (
                      <div className="pt-2 flex items-start gap-2 text-xs text-neutral-500">
                        <span className="font-semibold text-neutral-700 shrink-0">Latest Update:</span>
                        <span className="truncate italic">"{latestUpdate.message}"</span>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <div className="text-left sm:text-right text-xs">
                      <div className="text-neutral-400 text-[11px]">
                        Submitted {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                      {assignedStaff ? (
                        <div className="text-neutral-700 text-xs font-medium mt-0.5 flex items-center gap-1 sm:justify-end">
                          <User className="w-3 h-3 text-neutral-400" />
                          <span>{assignedStaff.fullName}</span>
                        </div>
                      ) : (
                        <div className="text-amber-600 text-[11px] mt-0.5">
                          Pending Assignment
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/portal/requests/${req.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-900 text-xs font-semibold text-neutral-900 transition"
                    >
                      <span>Open Details</span>
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

