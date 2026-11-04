import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Hash,
  Briefcase,
  FileText,
  ClipboardList,
  ShieldCheck,
  Download,
} from 'lucide-react';
import {
  REQUEST_STATUS_LABELS,
  SERVICE_CATEGORY_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  RequestStatus,
  ServiceCategory,
  DocumentCategory,
} from '@/lib/types';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function AdminClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    redirect('/login');
  }

  const client = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      clientProfile: true,
      clientRequests: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          assignments: {
            include: {
              employee: { select: { fullName: true } },
            },
          },
        },
      },
      documentsUploaded: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      complianceRecords: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { tasks: true },
      },
      notifications: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!client || client.role !== 'CLIENT') {
    redirect('/admin/clients');
  }

  const p = client.clientProfile;

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Client Directory
      </Link>

      {/* Client Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-neutral-950">
                {p?.organizationName || client.fullName}
              </h1>
              {client.isActive ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-emerald-50 border-emerald-200 text-emerald-700">
                  Active
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-700">
                  Inactive
                </span>
              )}
            </div>
            {p?.organizationName && (
              <p className="text-sm text-neutral-500">Contact: {client.fullName}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-neutral-500 mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {client.email}
              </span>
              {client.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {client.phone}
                </span>
              )}
              <span className="text-neutral-400">Joined {formatDate(client.createdAt)}</span>
            </div>
          </div>
          <div className="flex gap-3 text-xs font-semibold">
            <div className="text-center px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg">
              <span className="block text-lg font-bold text-neutral-900">{client.clientRequests.length}</span>
              <span className="text-neutral-500">Requests</span>
            </div>
            <div className="text-center px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg">
              <span className="block text-lg font-bold text-neutral-900">{client.documentsUploaded.length}</span>
              <span className="text-neutral-500">Documents</span>
            </div>
            <div className="text-center px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg">
              <span className="block text-lg font-bold text-neutral-900">{client.complianceRecords.length}</span>
              <span className="text-neutral-500">Compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-neutral-400" />
          <h2 className="text-sm font-bold text-neutral-900">Organisation Profile</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ProfileField icon={<Building2 className="w-3.5 h-3.5" />} label="Organisation" value={p?.organizationName} />
          <ProfileField icon={<Briefcase className="w-3.5 h-3.5" />} label="Business Type" value={p?.businessType} />
          <ProfileField icon={<Briefcase className="w-3.5 h-3.5" />} label="Industry" value={p?.industry} />
          <ProfileField icon={<MapPin className="w-3.5 h-3.5" />} label="Address" value={p?.address} />
          <ProfileField icon={<Hash className="w-3.5 h-3.5" />} label="Tax ID / GSTIN" value={p?.taxId} />
          <ProfileField icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={client.phone} />
        </div>
      </div>

      {/* Recent Service Requests */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-bold text-neutral-900">Recent Service Requests</h2>
          </div>
          <span className="text-[10px] text-neutral-400">Last {client.clientRequests.length} records</span>
        </div>
        {client.clientRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">No service requests submitted yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Tracking No.</th>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Assigned Counsel</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {client.clientRequests.map((req) => {
                  const statusStyle = REQUEST_STATUS_LABELS[req.status as RequestStatus] ?? {
                    label: req.status,
                    color: 'text-neutral-700',
                    bg: 'bg-neutral-50 border-neutral-200',
                  };
                  const catLabel =
                    SERVICE_CATEGORY_LABELS[req.category as ServiceCategory]?.label ?? req.category;
                  const counsel = req.assignments?.[0]?.employee?.fullName;

                  return (
                    <tr key={req.id} className="hover:bg-neutral-50/60 transition">
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/requests/${req.id}`}
                          className="font-mono text-[10px] font-bold text-neutral-600 hover:text-neutral-900"
                        >
                          {req.trackingNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-neutral-900 max-w-[200px] truncate">
                        {req.title}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          {catLabel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {counsel ? (
                          <span className="font-semibold text-neutral-800">{counsel}</span>
                        ) : (
                          <span className="text-amber-600 font-semibold text-[10px]">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-500 text-[11px]">
                        {formatDate(req.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-bold text-neutral-900">Uploaded Documents</h2>
          </div>
          <span className="text-[10px] text-neutral-400">Last {client.documentsUploaded.length} records</span>
        </div>
        {client.documentsUploaded.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">No documents uploaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Document Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Size</th>
                  <th className="px-5 py-3">Uploaded</th>
                  <th className="px-5 py-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {client.documentsUploaded.map((doc) => (
                  <tr key={doc.id} className="hover:bg-neutral-50/60 transition">
                    <td className="px-5 py-3.5 font-medium text-neutral-900 max-w-[220px] truncate">
                      {doc.title}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-medium text-neutral-600">
                        {DOCUMENT_CATEGORY_LABELS[doc.category as DocumentCategory] ?? doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-700">
                        {doc.fileType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-neutral-500">
                      {formatBytes(doc.fileSize)}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-500 text-[11px]">
                      {formatDate(doc.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={`/api/documents/${doc.id}/download`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded border border-neutral-300 text-neutral-700 text-[11px] font-semibold hover:bg-neutral-50 transition"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compliance Records */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-neutral-400" />
          <h2 className="text-sm font-bold text-neutral-900">Compliance Records</h2>
        </div>
        {client.complianceRecords.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">No compliance records on file.</div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {client.complianceRecords.map((record) => {
              const isOverdue =
                record.status !== 'COMPLIED' && new Date(record.deadline) < new Date();
              const completedTasks = record.tasks.filter((t) => t.isCompleted).length;

              return (
                <div key={record.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-neutral-900 text-sm">{record.title}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          record.status === 'COMPLIED'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : isOverdue
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {isOverdue && record.status !== 'COMPLIED' ? 'Overdue' : record.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                      <span>Deadline: {formatDate(record.deadline)}</span>
                      <span>
                        Tasks: {completedTasks}/{record.tasks.length} completed
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400">{record.trackingNumber}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium text-neutral-800">{value || <span className="text-neutral-400 font-normal">Not provided</span>}</p>
    </div>
  );
}
