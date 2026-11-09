import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
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
  ChevronRight,
  ShieldCheck,
  Calendar,
  PhoneCall,
  Lock,
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
        take: 4,
        include: { tasks: true },
      }),
    ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Counsel Network Active
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-[11px] font-mono text-neutral-400">
              ID: {user.id.slice(0, 8)}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Welcome back, {user.fullName.split(' ')[0]}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {user.clientProfile?.organizationName || 'Corporate Client Workspace'} · Privileged Legal Operations Console
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/agreements"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 hover:border-neutral-900 bg-white text-neutral-800 text-xs font-semibold transition"
          >
            <FileSignature className="w-3.5 h-3.5 text-neutral-600" />
            <span>My Agreements</span>
          </Link>
          <Link
            href="/portal/requests/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Service Request</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-neutral-300 transition group">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Total Matters
            </span>
            <div className="w-7 h-7 rounded-lg bg-neutral-50 group-hover:bg-neutral-100 flex items-center justify-center transition">
              <FileText className="w-3.5 h-3.5 text-neutral-700" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-neutral-950">{totalRequests}</div>
          <p className="text-[11px] text-neutral-400 mt-1">Submitted legal matters</p>
        </div>

        {/* Active In-Progress */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-neutral-300 transition group">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Active In-Review
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 group-hover:bg-indigo-100/70 flex items-center justify-center transition">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-neutral-950">{activeRequests}</div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">Counsel drafting & vetting</p>
        </div>

        {/* Pending Action */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-neutral-300 transition group">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Action Required
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 group-hover:bg-amber-100/70 flex items-center justify-center transition">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-neutral-950">{pendingActions}</div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Awaiting client response</p>
        </div>

        {/* Completed */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-neutral-300 transition group">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Completed
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-100/70 flex items-center justify-center transition">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-neutral-950">{completedRequests}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Executed & delivered</p>
        </div>
      </div>

      {/* Signature Alert Banner if pending agreements */}
      {pendingAgreements.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-300/80 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <FileSignature className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900">
                    Statutory Action Required
                  </span>
                  <span className="text-xs text-amber-800 font-medium">
                    Section 10A IT Act Digital Execution
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-950">
                  Agreements Awaiting Your Digital Signature ({pendingAgreements.length})
                </h3>
                <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
                  Finalized covenants are ready for your review and execution. Enter your 6-digit access code to verify identity and adopt your digital signature.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-amber-200/70">
            {pendingAgreements.map((agr) => (
              <div
                key={agr.id}
                className="flex flex-col justify-between p-3.5 bg-white rounded-xl border border-amber-200 text-xs shadow-xs hover:border-amber-400 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-neutral-500">
                      {agr.trackingNumber}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Awaiting Sign
                    </span>
                  </div>
                  <h4 className="font-bold text-neutral-900 line-clamp-1">{agr.title}</h4>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">
                    {agr.parties.length} Signatories
                  </span>
                  <Link
                    href={`/agreements/sign/${agr.secureShareToken}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 text-white text-[11px] font-semibold hover:bg-neutral-800 transition"
                  >
                    <span>Review & Sign</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two-Column Main Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recently Updated Requests (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Recent Legal Matters
              </h2>
              <p className="text-xs text-neutral-500">Live docket status and active counsel notes</p>
            </div>
            <Link
              href="/portal/requests"
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 inline-flex items-center gap-1"
            >
              <span>View All Matters</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">No legal service requests submitted yet</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Submit an MOU drafting, commercial contract vetting, or compliance request to begin.
                </p>
              </div>
              <Link
                href="/portal/requests/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Your First Request</span>
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200/90 rounded-2xl divide-y divide-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
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
                    className="p-5 block hover:bg-neutral-50/70 transition group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] text-neutral-600 font-bold bg-neutral-100 px-2 py-0.5 rounded">
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

                        <h4 className="text-sm font-bold text-neutral-950 group-hover:text-neutral-700 transition truncate">
                          {req.title}
                        </h4>

                        {lastUpdate ? (
                          <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 rounded-lg p-2 border border-neutral-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                            <span className="line-clamp-1 text-[11px]">
                              Latest Counsel Update: {lastUpdate.message}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-400 line-clamp-1">
                            Awaiting initial review from intake desk.
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-neutral-400 block font-mono">
                          {new Date(req.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {assignedCounsel ? (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-100 text-neutral-800 text-[11px] font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Adv. {assignedCounsel.fullName.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className="mt-2 inline-block text-[10px] text-neutral-400">Intake Desk</span>
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
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-neutral-900" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                  Compliance Ledger
                </h3>
              </div>
              <Link
                href="/portal/compliance"
                className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-950"
              >
                Full Calendar →
              </Link>
            </div>

            {complianceRecords.length === 0 ? (
              <div className="text-center py-6">
                <ShieldCheck className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-medium">No statutory deadlines pending</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">All regulatory filings are up to date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {complianceRecords.map((cmp) => {
                  const daysLeft = Math.ceil(
                    (new Date(cmp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  const isUrgent = daysLeft <= 7;
                  return (
                    <div
                      key={cmp.id}
                      className="p-3.5 rounded-xl border border-neutral-200/70 bg-neutral-50/60 hover:bg-neutral-50 transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase">
                          {cmp.authority}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isUrgent
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-neutral-200/80 text-neutral-800'
                          }`}
                        >
                          {daysLeft > 0 ? `${daysLeft} days remaining` : 'Due today'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-neutral-900 line-clamp-1">{cmp.title}</p>
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                        <span>Due: {new Date(cmp.deadline).toLocaleDateString()}</span>
                        <span className="font-mono text-[10px]">{cmp.tasks.length} sub-tasks</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Support & Counsel Details */}
          <div className="bg-neutral-950 text-white rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                Direct Counsel Service Desk
              </h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              Every matter submitted is protected by strict attorney-client privilege protocols under the Advocates Act, 1961.
            </p>
            <div className="pt-3 border-t border-neutral-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Emergency Desk:</span>
                <a href="tel:+911149887700" className="font-mono text-white font-semibold hover:underline">
                  +91 11 4988 7700
                </a>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Counsel Chambers:</span>
                <span className="text-white">Connaught Place, New Delhi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
