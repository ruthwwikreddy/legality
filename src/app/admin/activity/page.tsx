import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ScrollText, Clock, User, Shield, Info } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminActivityPage() {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    redirect('/portal');
  }

  const [logs, totalCount] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            fullName: true,
            role: true,
            email: true,
          },
        },
      },
    }),
    prisma.activityLog.count(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-neutral-800" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-950">
              Activity Audit Log
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Immutable system-wide action tracking for regulatory compliance and audit trails. Showing last {logs.length} of {totalCount} events.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      {logs.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <ScrollText className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No activity recorded yet</h3>
          <p className="text-xs text-neutral-500">System actions, logins, and status transitions will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-5 py-3.5">Entity Type</th>
                  <th className="px-5 py-3.5">Entity ID / Ref</th>
                  <th className="px-5 py-3.5">Details</th>
                  <th className="px-5 py-3.5">Triggered By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs.map((log) => {
                  let formattedDetails = log.details || '—';
                  try {
                    // If JSON string, format concisely
                    if (log.details && (log.details.startsWith('{') || log.details.startsWith('['))) {
                      const parsed = JSON.parse(log.details);
                      formattedDetails = Object.entries(parsed)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' · ');
                    }
                  } catch {
                    formattedDetails = log.details || '—';
                  }

                  const userRoleBadge =
                    log.user?.role === 'ADMIN'
                      ? 'bg-neutral-900 text-white'
                      : log.user?.role === 'EMPLOYEE'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-neutral-100 text-neutral-700';

                  return (
                    <tr key={log.id} className="hover:bg-neutral-50/70 transition">
                      <td className="px-5 py-3.5 whitespace-nowrap text-neutral-500 text-[11px] font-mono">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-neutral-50 border border-neutral-200 text-neutral-600">
                          {log.entityType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-neutral-600">
                        {log.entityId ? (
                          <span title={log.entityId}>
                            {log.entityId.length > 16
                              ? `${log.entityId.slice(0, 16)}...`
                              : log.entityId}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-5 py-3.5 max-w-xs truncate text-[11px] text-neutral-700" title={formattedDetails}>
                        {formattedDetails}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {log.user ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900">{log.user.fullName}</span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${userRoleBadge}`}>
                              {log.user.role}
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 font-mono text-[10px]">System Automated</span>
                        )}
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

