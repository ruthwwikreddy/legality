'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Plus,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ComplianceTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface ComplianceRecord {
  id: string;
  trackingNumber: string;
  title: string;
  category: string;
  authority: string;
  deadline: string;
  status: ComplianceStatus;
  createdAt: string;
  updatedAt: string;
  client: {
    fullName: string;
    clientProfile: { organizationName: string | null } | null;
  };
  tasks: ComplianceTask[];
}

type ComplianceStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'UNDER_REVIEW'
  | 'COMPLIED'
  | 'OVERDUE';

interface ClientOption {
  id: string;
  fullName: string;
  clientProfile: { organizationName: string | null } | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: ComplianceStatus[] = [
  'PENDING',
  'IN_PROGRESS',
  'UNDER_REVIEW',
  'COMPLIED',
  'OVERDUE',
];

const STATUS_STYLES: Record<ComplianceStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  UNDER_REVIEW: { label: 'Under Review', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  COMPLIED: { label: 'Complied', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  OVERDUE: { label: 'Overdue', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function DeadlinePill({ deadline }: { deadline: string }) {
  const days = daysUntil(deadline);
  const dateLabel = new Date(deadline).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (days < 0) {
    return (
      <span className="block">
        <span className="font-semibold text-rose-600 text-xs">{dateLabel}</span>
        <span className="ml-1.5 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
          {Math.abs(days)}d overdue
        </span>
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="block">
        <span className="font-semibold text-orange-600 text-xs">{dateLabel}</span>
        <span className="ml-1.5 text-[10px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
          {days}d left
        </span>
      </span>
    );
  }
  return (
    <span className="block">
      <span className="text-xs text-neutral-700">{dateLabel}</span>
      <span className="ml-1.5 text-[10px] text-neutral-500">{days}d left</span>
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminCompliancePage() {
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Create form state
  const [formClientId, setFormClientId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formAuthority, setFormAuthority] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Status update state per record
  const [pendingStatus, setPendingStatus] = useState<Record<string, ComplianceStatus>>({});
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  // Task toggling
  const [taskUpdating, setTaskUpdating] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (searchTerm) params.set('search', searchTerm);
      const res = await fetch(`/api/compliance?${params.toString()}`);
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    // Fetch clients for the create form
    fetch('/api/admin/clients')
      .then((r) => r.json())
      .then((d) => { if (d.clients) setClients(d.clients); })
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');
    try {
      const res = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: formClientId,
          title: formTitle,
          category: formCategory,
          authority: formAuthority,
          deadline: formDeadline,
          notes: formNotes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to create record');
      } else {
        setShowForm(false);
        setFormClientId('');
        setFormTitle('');
        setFormCategory('');
        setFormAuthority('');
        setFormDeadline('');
        setFormNotes('');
        await fetchRecords();
      }
    } catch {
      setFormError('An unexpected error occurred.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleStatusUpdate = async (recordId: string) => {
    const newStatus = pendingStatus[recordId];
    if (!newStatus) return;
    setStatusUpdating(recordId);
    try {
      await fetch(`/api/compliance/${recordId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchRecords();
    } catch (e) {
      console.error(e);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleTaskToggle = async (recordId: string, taskId: string, current: boolean) => {
    setTaskUpdating(taskId);
    try {
      await fetch(`/api/compliance/${recordId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !current }),
      });
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? {
                ...r,
                tasks: r.tasks.map((t) =>
                  t.id === taskId ? { ...t, isCompleted: !current } : t
                ),
              }
            : r
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setTaskUpdating(null);
    }
  };

  const filteredRecords = records.filter((r) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.client.fullName.toLowerCase().includes(q) ||
      (r.client.clientProfile?.organizationName ?? '').toLowerCase().includes(q) ||
      r.trackingNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center border border-neutral-200">
            <ShieldAlert className="w-4.5 h-4.5 text-neutral-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-950">Compliance Tracking</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {loading ? 'Loading…' : `${records.length} record${records.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? 'Cancel' : 'Create Compliance Record'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900 mb-5">New Compliance Record</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Client <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formClientId}
                  onChange={(e) => setFormClientId(e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900 pr-8"
                >
                  <option value="">Select client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.clientProfile?.organizationName
                        ? `${c.clientProfile.organizationName} (${c.fullName})`
                        : c.fullName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Annual FSSAI Renewal"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. GST Filing, MCA Annual Return"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Authority */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Authority <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formAuthority}
                onChange={(e) => setFormAuthority(e.target.value)}
                placeholder="e.g. Ministry of Corporate Affairs"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Notes</label>
              <textarea
                rows={2}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Optional notes or instructions…"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
              />
            </div>

            {formError && (
              <div className="md:col-span-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {formError}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={formSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {formSubmitting ? 'Creating…' : 'Create Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, client, or tracking number…"
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </form>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_STYLES[s].label}</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Records */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading compliance records…</div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-14 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No records found</h3>
          <p className="text-xs text-neutral-500">Create a record or change filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5 w-6"></th>
                  <th className="px-5 py-3.5">Tracking No.</th>
                  <th className="px-5 py-3.5">Title &amp; Category</th>
                  <th className="px-5 py-3.5">Client</th>
                  <th className="px-5 py-3.5">Authority</th>
                  <th className="px-5 py-3.5">Deadline</th>
                  <th className="px-5 py-3.5">Tasks</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredRecords.map((rec) => {
                  const st = STATUS_STYLES[rec.status] ?? {
                    label: rec.status,
                    color: 'text-neutral-700',
                    bg: 'bg-neutral-100 border-neutral-300',
                  };
                  const completedTasks = rec.tasks.filter((t) => t.isCompleted).length;
                  const isExpanded = expandedId === rec.id;
                  const selectVal = pendingStatus[rec.id] ?? rec.status;

                  return (
                    <>
                      <tr key={rec.id} className="hover:bg-neutral-50/60 transition">
                        {/* Expand toggle */}
                        <td className="pl-4 pr-1 py-3.5">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                            className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition"
                            title={isExpanded ? 'Collapse tasks' : 'Expand tasks'}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-[10px] font-bold text-neutral-500">
                            {rec.trackingNumber}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-neutral-900 block max-w-[180px] truncate" title={rec.title}>
                            {rec.title}
                          </span>
                          <span className="text-[10px] text-neutral-400 mt-0.5 block">{rec.category}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-neutral-800 block max-w-[140px] truncate">
                            {rec.client.clientProfile?.organizationName || rec.client.fullName}
                          </span>
                          {rec.client.clientProfile?.organizationName && (
                            <span className="text-[10px] text-neutral-400">{rec.client.fullName}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 max-w-[140px]">
                          <span className="block truncate" title={rec.authority}>{rec.authority}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <DeadlinePill deadline={rec.deadline} />
                        </td>
                        <td className="px-5 py-3.5">
                          {rec.tasks.length === 0 ? (
                            <span className="text-[10px] text-neutral-400">No tasks</span>
                          ) : (
                            <span className={`text-xs font-semibold ${completedTasks === rec.tasks.length ? 'text-emerald-600' : 'text-neutral-700'}`}>
                              {completedTasks}/{rec.tasks.length}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${st.bg} ${st.color}`}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <select
                                value={selectVal}
                                onChange={(e) =>
                                  setPendingStatus((prev) => ({
                                    ...prev,
                                    [rec.id]: e.target.value as ComplianceStatus,
                                  }))
                                }
                                className="appearance-none pl-2 pr-6 py-1 bg-white border border-neutral-300 rounded text-[11px] text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>{STATUS_STYLES[s].label}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <button
                              disabled={selectVal === rec.status || statusUpdating === rec.id}
                              onClick={() => handleStatusUpdate(rec.id)}
                              className="px-2.5 py-1 bg-neutral-900 text-white text-[11px] font-semibold rounded hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                              {statusUpdating === rec.id ? '…' : 'Save'}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded task list */}
                      {isExpanded && (
                        <tr key={`${rec.id}-tasks`} className="bg-neutral-50/60">
                          <td />
                          <td colSpan={8} className="px-5 py-4">
                            {rec.tasks.length === 0 ? (
                              <p className="text-xs text-neutral-400 italic">No tasks assigned to this record.</p>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                  Tasks — {completedTasks}/{rec.tasks.length} completed
                                </p>
                                {rec.tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className="flex items-center gap-3 bg-white border border-neutral-200 rounded-lg px-4 py-2.5"
                                  >
                                    <button
                                      disabled={taskUpdating === task.id}
                                      onClick={() => handleTaskToggle(rec.id, task.id, task.isCompleted)}
                                      className="shrink-0 text-neutral-500 hover:text-neutral-900 transition disabled:opacity-50"
                                    >
                                      {task.isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <Circle className="w-4 h-4" />
                                      )}
                                    </button>
                                    <span
                                      className={`text-xs font-medium flex-1 ${
                                        task.isCompleted ? 'line-through text-neutral-400' : 'text-neutral-800'
                                      }`}
                                    >
                                      {task.title}
                                    </span>
                                    {task.isCompleted && (
                                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                        Done
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
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
