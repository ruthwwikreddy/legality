import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import {
  Users,
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSignature,
  ArrowRight,
  PlusCircle,
  Shield,
  FileText,
} from 'lucide-react';
import {
  REQUEST_STATUS_LABELS,
  SERVICE_CATEGORY_LABELS,
  RequestStatus,
  ServiceCategory,
} from '@/lib/types';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [
    totalClients,
    totalRequests,
    newRequests,
    activeRequests,
    pendingApprovals,
    pendingSignatures,
    completedRequests,
    recentRequests,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT', isActive: true } }),
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: 'SUBMITTED' } }),
    prisma.serviceRequest.count({
      where: { status: { in: ['IN_PROGRESS', 'UNDER_REVIEW', 'AWAITING_CLIENT_INFO'] } },
    }),
    prisma.serviceRequest.count({ where: { status: 'AWAITING_APPROVAL' } }),
    prisma.agreement.count({
      where: { status: { in: ['AWAITING_SIGNATURES', 'PARTIALLY_SIGNED'] } },
    }),
    prisma.serviceRequest.count({ where: { status: 'COMPLETED' } }),
    prisma.serviceRequest.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            fullName: true,
            email: true,
            clientProfile: { select: { organizationName: true } },
          },
        },
        assignments: {
          include: {
            employee: { select: { fullName: true } },
          },
        },
      },
    }),
    prisma.activityLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, role: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
            Operations & Administrative Console
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            System overview · {user.fullName} ({user.employeeProfile?.designation || user.role})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/agreements/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-neutral-300 hover:border-neutral-900 text-xs font-semibold text-neutral-800 transition"
          >
            <FileSignature className="w-3.5 h-3.5 text-neutral-700" />
            <span>Create Agreement</span>
          </Link>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Manage All Requests</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Total Clients
          </span>
          <div className="text-2xl font-bold text-neutral-950">{totalClients}</div>
          <span className="text-[10px] text-neutral-500">Registered</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Total Requests
          </span>
          <div className="text-2xl font-bold text-neutral-950">{totalRequests}</div>
          <span className="text-[10px] text-neutral-500">All time</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
            New Requests
          </span>
          <div className="text-2xl font-bold text-blue-700">{newRequests}</div>
          <span className="text-[10px] text-neutral-500">Unassigned / Intake</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Active Matters
          </span>
          <div className="text-2xl font-bold text-indigo-700">{activeRequests}</div>
          <span className="text-[10px] text-neutral-500">Under Review</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
            Approvals
          </span>
          <div className="text-2xl font-bold text-purple-700">{pendingApprovals}</div>
          <span className="text-[10px] text-neutral-500">Partner review</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Signatures
          </span>
          <div className="text-2xl font-bold text-amber-700">{pendingSignatures}</div>
          <span className="text-[10px] text-neutral-500">Awaiting sign</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Completed
          </span>
          <div className="text-2xl font-bold text-emerald-700">{completedRequests}</div>
          <span className="text-[10px] text-neutral-500">Executed</span>
        </div>
      </div>

      {/* Main Grid: Incoming Matters & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Incoming Matters Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Recent Incoming Requests
            </h2>
            <Link
              href="/admin/requests"
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1"
            >
              <span>View All Requests</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Tracking & Title</th>
                    <th className="px-5 py-3">Client</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Assigned Counsel</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentRequests.map((req) => {
                    const statusStyle =
                      REQUEST_STATUS_LABELS[req.status as RequestStatus] || {
                        label: req.status,
                        color: 'text-neutral-700',
                        bg: 'bg-neutral-50 border-neutral-200',
                      };
                    const catLabel =
                      SERVICE_CATEGORY_LABELS[req.category as ServiceCategory]?.label ||
                      req.category;
                    const assigned = req.assignments[0]?.employee;

                    return (
                      <tr key={req.id} className="hover:bg-neutral-50/70 transition">
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-[10px] text-neutral-500 block font-bold">
                            {req.trackingNumber}
                          </span>
                          <span className="font-bold text-neutral-900 truncate block max-w-xs">
                            {req.title}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-neutral-800 block truncate">
                            {req.client.clientProfile?.organizationName || req.client.fullName}
                          </span>
                          <span className="text-[10px] text-neutral-400 block font-mono">
                            {req.client.email}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                            {catLabel}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {assigned ? (
                            <span className="font-semibold text-neutral-900">{assigned.fullName}</span>
                          ) : (
                            <span className="text-amber-600 font-semibold text-[11px]">Unassigned</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}
                          >
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/admin/requests/${req.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-semibold transition"
                          >
                            <span>Open</span>
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
        </div>

        {/* Audit Activity Stream (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Activity Audit Trail
            </h2>
            <Link
              href="/admin/activity"
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1"
            >
              <span>Full Log</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            {recentActivity.map((log) => (
              <div key={log.id} className="text-xs space-y-1 pb-3 border-b border-neutral-100 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 font-mono text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-neutral-600 text-[11px] leading-relaxed">
                  {log.details || log.entityType}
                </p>
                {log.user && (
                  <div className="text-[10px] text-neutral-400 font-mono">
                    By: {log.user.fullName} ({log.user.role})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

