'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Users, ArrowRight, Building2, Inbox } from 'lucide-react';

interface ClientProfile {
  organizationName: string | null;
  businessType: string | null;
  industry: string | null;
  taxId: string | null;
  address: string | null;
}

interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  clientProfile: ClientProfile | null;
  _count: {
    clientRequests: number;
    documentsUploaded: number;
  };
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/clients');
        if (!res.ok) throw new Error('Failed to fetch clients');
        const data = await res.json();
        setClients(data.clients ?? []);
      } catch (e) {
        setError('Failed to load client directory. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const q = searchTerm.toLowerCase();
    return clients.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.clientProfile?.organizationName ?? '').toLowerCase().includes(q)
    );
  }, [clients, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">Client Directory</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {loading ? 'Loading…' : `${clients.length} registered client${clients.length !== 1 ? 's' : ''} on the platform`}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg text-xs font-semibold text-neutral-700">
          <Users className="w-3.5 h-3.5" />
          <span>{clients.length} Total</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or organisation…"
          className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading client directory…</div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-xs text-rose-700 font-medium">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <Inbox className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">
            {searchTerm ? 'No clients match your search' : 'No clients registered yet'}
          </h3>
          <p className="text-xs text-neutral-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Clients will appear here once they register.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Client / Organisation</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Business Type</th>
                  <th className="px-5 py-3.5 text-center">Total Requests</th>
                  <th className="px-5 py-3.5 text-center">Documents</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-neutral-50/70 transition">
                    <td className="px-5 py-4">
                      <span className="font-bold text-neutral-900 block">
                        {client.clientProfile?.organizationName || client.fullName}
                      </span>
                      {client.clientProfile?.organizationName && (
                        <span className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {client.fullName}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-neutral-800 block">{client.email}</span>
                      {client.phone && (
                        <span className="text-[10px] text-neutral-400 font-mono">{client.phone}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {client.clientProfile?.businessType ? (
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          {client.clientProfile.businessType}
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-neutral-800">
                      {client._count.clientRequests}
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-neutral-800">
                      {client._count.documentsUploaded}
                    </td>
                    <td className="px-5 py-4">
                      {client.isActive ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-emerald-50 border-emerald-200 text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-neutral-500 text-[11px]">
                      {new Date(client.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 transition"
                      >
                        View Profile
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {searchTerm && filtered.length !== clients.length && (
            <div className="border-t border-neutral-100 px-5 py-2.5 text-[10px] text-neutral-400">
              Showing {filtered.length} of {clients.length} clients
            </div>
          )}
        </div>
      )}
    </div>
  );
}
