'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ArrowRight,
  User,
  Inbox,
} from 'lucide-react';
import {
  REQUEST_STATUS_LABELS,
  SERVICE_CATEGORY_LABELS,
  SERVICE_CATEGORIES,
  RequestStatus,
  ServiceCategory,
} from '@/lib/types';

export default function AdminRequestsPage() {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">All Service Requests</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Manage, assign, and update all incoming legal matters</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, tracking number, or client..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </form>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        >
          <option value="">All Categories</option>
          {Object.entries(SERVICE_CATEGORIES).map(([key, val]) => (
            <option key={key} value={val}>{SERVICE_CATEGORY_LABELS[val as ServiceCategory]?.label}</option>
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

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading all requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <Inbox className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No requests found</h3>
          <p className="text-xs text-neutral-500">No requests match the active filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Reference & Title</th>
                  <th className="px-5 py-3.5">Client Entity</th>
                  <th className="px-5 py-3.5">Service Category</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Assigned Counsel</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date Filed</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {requests.map((req) => {
                  const statusStyle = REQUEST_STATUS_LABELS[req.status as RequestStatus] || {
                    label: req.status, color: 'text-neutral-700', bg: 'bg-neutral-50 border-neutral-200'
                  };
                  const catLabel = SERVICE_CATEGORY_LABELS[req.category as ServiceCategory]?.label || req.category;
                  const assigned = req.assignments?.[0]?.employee;

                  return (
                    <tr key={req.id} className="hover:bg-neutral-50/70 transition">
                      <td className="px-5 py-4">
                        <span className="font-mono text-[10px] text-neutral-500 block font-bold">{req.trackingNumber}</span>
                        <span className="font-bold text-neutral-900 block max-w-xs truncate">{req.title}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-neutral-800 block truncate max-w-[150px]">
                          {req.client?.clientProfile?.organizationName || req.client?.fullName}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">{req.client?.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          {catLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-mono font-bold ${
                          req.priority === 'URGENT' ? 'text-rose-600' :
                          req.priority === 'HIGH' ? 'text-orange-600' :
                          'text-neutral-600'
                        }`}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {assigned ? (
                          <span className="font-semibold text-neutral-900">{assigned.fullName}</span>
                        ) : (
                          <span className="text-amber-600 font-semibold text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-neutral-500 text-[11px]">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/requests/${req.id}`}
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

