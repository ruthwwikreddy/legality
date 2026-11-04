import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  FileSignature,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { REQUEST_STATUS_LABELS, SERVICE_CATEGORY_LABELS, RequestStatus, ServiceCategory } from '@/lib/types';

export default async function ClientDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Aggregate client metrics live from database
  const [totalRequests, activeRequests, pendingActions, completedRequests, recentRequests, pendingAgreements, complianceRecords] =
    await Promise.all([
      prisma.serviceRequest.count({ where: { clientId: user.id } }),
      prisma.serviceRequest.count({
        where: {
          clientId: user.id,
          status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS'] },
        },
      }),
      prisma.serviceRequest.count({
        where: {
          clientId: user.id,
          status: 'AWAITING_CLIENT_INFO',
        },
      }),
      prisma.serviceRequest.count({
        where: {
          clientId: user.id,
          status: 'COMPLETED',
        },
      }),
      prisma.serviceRequest.findMany({
        where: { clientId: user.id },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
          assignments: {
            include: {
              employee: {
                select: {
                  fullName: true,
                  employeeProfile: { select: { designation: true } },
                },
              },
            },
          },
          updates: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.agreement.findMany({
        where: {
          parties: {
            some: {
              email: user.email,
              status: { in: ['PENDING', 'VIEWED', 'REVIEWED'] },
            },
          },
        },
        include: {
          parties: true,
        },
        take: 3,
      }),
      prisma.complianceRecord.findMany({
        where: { clientId: user.id },
        orderBy: { deadline: 'asc' },
        take: 3,
        include: { tasks: true },
      }),
    ]);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
            Welcome back, {user.fullName.split(' ')[0]}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {user.clientProfile?.organizationName || 'Legal Operations Dashboard'} · Direct Counsel Service Line
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/requests/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Service Request</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Requests</span>
            <FileText className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{totalRequests}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Submitted legal matters</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active In-Progress</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{activeRequests}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Under legal drafting & review</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Action</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{pendingActions}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Awaiting client information</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{completedRequests}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Executed & delivered</p>
        </div>
      </div>

      {/* Signature Alert Banner if pending agreements */}
      {pendingAgreements.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <FileSignature className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Agreements Awaiting Your Digital Signature ({pendingAgreements.length})
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  You have legally binding MOUs or agreements ready for review and digital signature.
                </p>
                <div className="mt-3 space-y-2">
                  {pendingAgreements.map((agr) => (
                    <div
                      key={agr.id}
                      className="flex items-center justify-between gap-4 p-2.5 bg-white rounded-lg border border-amber-200 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-neutral-900">{agr.title}</span>
                        <span className="text-neutral-500 ml-2 font-mono">[{agr.trackingNumber}]</span>
                      </div>
                      <Link
                        href={`/agreements/sign/${agr.secureShareToken}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 shrink-0"
                      >
                        <span>Review & Sign</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Main Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recently Updated Requests (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Recently Updated Requests
            </h2>
            <Link
              href="/portal/requests"
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1"
            >
              View All Requests <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="text-xs text-neutral-500">No legal service requests submitted yet.</p>
              <Link
                href="/portal/requests/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold"
              >
                Create Your First Request
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 shadow-sm overflow-hidden">
              {recentRequests.map((req) => {
                const statusStyle =
                  REQUEST_STATUS_LABELS[req.status as RequestStatus] || {
                    label: req.status,
                    color: 'text-neutral-700',
                    bg: 'bg-neutral-50 border-neutral-200',
                  };
                const catLabel =
                  SERVICE_CATEGORY_LABELS[req.category as ServiceCategory]?.label || req.category;
                const assignedCounsel = req.assignments[0]?.employee;
                const lastUpdate = req.updates[0];

                return (
                  <Link
                    key={req.id}
                    href={`/portal/requests/${req.id}`}
                    className="p-5 block hover:bg-neutral-50/80 transition group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] text-neutral-500 font-medium">
                            {req.trackingNumber}
                          </span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                            {catLabel}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}
                          >
                            {statusStyle.label}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 truncate">
                          {req.title}
                        </h4>

                        {lastUpdate && (
                          <p className="text-xs text-neutral-600 line-clamp-1 mt-0.5">
                            {lastUpdate.message}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-neutral-400">
                          {new Date(req.updatedAt).toLocaleDateString()}
                        </span>
                        {assignedCounsel && (
                          <p className="text-[11px] text-neutral-600 mt-1">
                            Counsel: <span className="font-medium text-neutral-900">{assignedCounsel.fullName.split(' ')[0]}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Compliance & Quick Actions */}
        <div className="space-y-6">
          {/* Statutory Compliance Calendar Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-neutral-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Compliance Deadlines
                </h3>
              </div>
              <Link
                href="/portal/compliance"
                className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-950"
              >
                View
              </Link>
            </div>

            {complianceRecords.length === 0 ? (
              <p className="text-xs text-neutral-400">No active statutory deadlines.</p>
            ) : (
              <div className="space-y-3">
                {complianceRecords.map((cmp) => {
                  const daysLeft = Math.ceil(
                    (new Date(cmp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={cmp.id} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-neutral-500">{cmp.authority}</span>
                        <span className={`text-[10px] font-semibold ${daysLeft < 10 ? 'text-rose-600' : 'text-neutral-700'}`}>
                          {daysLeft > 0 ? `${daysLeft} days remaining` : 'Due today'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-900 line-clamp-1">{cmp.title}</p>
                      <p className="text-[11px] text-neutral-500">
                        Due: {new Date(cmp.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Support & Counsel Details */}
          <div className="bg-neutral-900 text-white rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              LEGALITY Direct Counsel Desk
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Every matter submitted is assigned a certified legal officer with privileged attorney-client communication safeguards.
            </p>
            <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
              Need urgent advisory? Call emergency counsel desk: <br />
              <span className="text-white font-mono font-medium">+91 11 4988 7700</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

