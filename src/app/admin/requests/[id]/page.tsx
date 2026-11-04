'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  Upload,
  UserPlus,
  Download,
  AlertCircle,
  CheckCircle2,
  Lock,
  FileText,
} from 'lucide-react';
import {
  REQUEST_STATUS_LABELS,
  SERVICE_CATEGORY_LABELS,
  RequestStatus,
  ServiceCategory,
} from '@/lib/types';

export default function AdminRequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [assignRole, setAssignRole] = useState('PRIMARY_COUNSEL');
  const [newStatus, setNewStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('LEGAL_DRAFT');
  const [isClientVisible, setIsClientVisible] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/requests/${requestId}`);
      const data = await res.json();
      if (data.request) setRequest(data.request);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.team) setTeam(data.team);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchRequest();
    fetchTeam();
  }, [requestId]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    setError('');
    try {
      const res = await fetch(`/api/requests/${requestId}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: selectedEmployee, role: assignRole }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback('Counsel assigned successfully.');
        fetchRequest();
      } else {
        setError(data.error);
      }
    } catch (e) { setError('Assignment failed'); }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;
    setError('');
    try {
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, message: statusMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback('Status updated and client notified.');
        setStatusMessage('');
        fetchRequest();
      } else {
        setError(data.error);
      }
    } catch (e) { setError('Status update failed'); }
  };

  const handleNotePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNote.trim()) return;
    try {
      const res = await fetch(`/api/requests/${requestId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: internalNote }),
      });
      const data = await res.json();
      if (data.success) {
        setInternalNote('');
        setFeedback('Internal note saved.');
        fetchRequest();
      }
    } catch (e) { console.error(e); }
  };

  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', docTitle || uploadFile.name);
      formData.append('category', docCategory);
      formData.append('requestId', requestId);
      formData.append('isClientVisible', String(isClientVisible));
      if (request?.client?.id) formData.append('clientId', request.client.id);

      const res = await fetch('/api/documents/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setUploadFile(null);
        setDocTitle('');
        setFeedback('Document uploaded and shared.');
        fetchRequest();
      }
    } catch (e) { setError('Upload failed'); }
  };

  if (loading) return <div className="p-12 text-center text-xs text-neutral-500">Loading matter details...</div>;
  if (!request) return (
    <div className="p-12 text-center space-y-3">
      <p className="text-xs text-neutral-500">Request not found.</p>
      <Link href="/admin/requests" className="text-xs underline font-semibold text-neutral-900">Back to requests</Link>
    </div>
  );

  const statusStyle = REQUEST_STATUS_LABELS[request.status as RequestStatus] || { label: request.status, color: 'text-neutral-700', bg: 'bg-neutral-50 border-neutral-200' };
  const catLabel = SERVICE_CATEGORY_LABELS[request.category as ServiceCategory]?.label || request.category;
  let dynamicParsed: any = null;
  try { if (request.dynamicData) dynamicParsed = JSON.parse(request.dynamicData); } catch {}

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <Link href="/admin/requests" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Requests</span>
      </Link>

      {feedback && <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">{feedback}</div>}
      {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">{error}</div>}

      {/* Request Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-neutral-800">{request.trackingNumber}</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">{catLabel}</span>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}>{statusStyle.label}</span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-neutral-50 border border-neutral-200 text-neutral-600">{request.priority}</span>
            </div>
            <h1 className="text-xl font-bold text-neutral-950">{request.title}</h1>
            <div className="text-xs text-neutral-500">
              Client: <span className="font-semibold text-neutral-900">{request.client?.clientProfile?.organizationName || request.client?.fullName}</span>
              {' · '}<span className="font-mono">{request.client?.email}</span>
            </div>
          </div>
          <div className="text-right text-xs text-neutral-400">
            <div>Filed: {new Date(request.createdAt).toLocaleDateString()}</div>
            <div>Updated: {new Date(request.updatedAt).toLocaleDateString()}</div>
            {request.estimatedCompletion && (
              <div className="text-neutral-700 font-medium mt-1">
                Target: {new Date(request.estimatedCompletion).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="bg-neutral-50/70 border border-neutral-100 rounded-lg p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Scope & Client Instructions</h4>
          <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
        </div>

        {dynamicParsed && (
          <div className="border border-neutral-200 rounded-lg p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Intake Data</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {Object.entries(dynamicParsed).map(([k, v]) => (
                <div key={k} className="p-2 bg-neutral-50 rounded">
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-semibold text-neutral-800">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Three-panel admin controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2-col): Status Updates, Internal Notes, Updates Thread */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Update */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">Update Request Status</h3>
            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                  className="px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="">Select new status...</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="AWAITING_CLIENT_INFO">Awaiting Client Info</option>
                  <option value="AWAITING_APPROVAL">Awaiting Approval</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <textarea
                rows={2}
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="Add a message to notify the client about this status change..."
                className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800">
                <Send className="w-3.5 h-3.5" />
                <span>Update Status & Notify Client</span>
              </button>
            </form>
          </div>

          {/* Updates Thread */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Communication History ({request.updates?.length || 0})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {request.updates?.map((u: any) => (
                <div key={u.id} className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  u.author.role === 'CLIENT' ? 'bg-blue-50/40 border-blue-100' : 'bg-neutral-50/60 border-neutral-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">{u.author.fullName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 font-mono">{u.author.role}</span>
                      {u.status && <span className="text-[10px] text-indigo-700 font-semibold font-mono">[→{u.status}]</span>}
                    </div>
                    <span className="text-[11px] text-neutral-400">{new Date(u.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{u.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-neutral-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">Internal Notes (Staff Only)</h3>
            </div>

            {request.internalNotes?.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {request.internalNotes.map((n: any) => (
                  <div key={n.id} className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900">{n.author.fullName}</span>
                      <span className="text-[11px] text-neutral-400">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleNotePost} className="space-y-2">
              <textarea
                rows={2}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Confidential note for legal team reference (not visible to client)..."
                className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button type="submit" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100">
                <Lock className="w-3.5 h-3.5" />
                <span>Save Internal Note</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right (1-col): Assign Counsel & Documents */}
        <div className="space-y-6">
          {/* Assignment */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Assign Counsel
            </h4>

            {request.assignments?.length > 0 && (
              <div className="space-y-2">
                {request.assignments.map((a: any) => (
                  <div key={a.id} className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 text-xs">
                    <span className="font-bold text-neutral-900">{a.employee.fullName}</span>
                    <span className="text-neutral-500 ml-2 font-mono text-[10px]">{a.role}</span>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{a.employee.employeeProfile?.designation}</div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAssign} className="space-y-3">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="">Select team member...</option>
                {team.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} — {m.employeeProfile?.designation || m.role}
                  </option>
                ))}
              </select>
              <select
                value={assignRole}
                onChange={(e) => setAssignRole(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="PRIMARY_COUNSEL">Primary Counsel</option>
                <option value="ASSOCIATE">Legal Associate</option>
                <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
                <option value="REVIEWER">Reviewing Partner</option>
              </select>
              <button type="submit" className="w-full py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800">
                Assign to Counsel
              </button>
            </form>
          </div>

          {/* Documents Panel */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Matter Documents ({request.documents?.length || 0})
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {request.documents?.map((doc: any) => (
                <div key={doc.id} className="p-2.5 rounded border border-neutral-200 bg-neutral-50/50 flex items-center justify-between text-xs gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-900 truncate">{doc.title}</p>
                    <span className="text-[10px] text-neutral-400 font-mono">{doc.category} · {(doc.fileSize / 1024).toFixed(0)}KB</span>
                    {!doc.isClientVisible && <span className="ml-1.5 text-[9px] text-rose-600 font-bold">STAFF ONLY</span>}
                  </div>
                  <a href={`/api/documents/${doc.id}/download`} download className="p-1 rounded hover:bg-neutral-200 text-neutral-700 transition">
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {/* Upload Form */}
            <form onSubmit={handleDocUpload} className="space-y-2.5 pt-3 border-t border-neutral-100">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Upload Legal Document</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Document title..."
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white focus:outline-none"
              >
                <option value="LEGAL_DRAFT">Legal Working Draft</option>
                <option value="FINAL_EXECUTED">Executed Agreement</option>
                <option value="APPROVAL_PERMIT">Official Licence / Permit</option>
                <option value="COMPLIANCE_FILING">Statutory Filing Receipt</option>
              </select>
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  id="clientVisible"
                  checked={isClientVisible}
                  onChange={(e) => setIsClientVisible(e.target.checked)}
                  className="rounded text-neutral-900"
                />
                <label htmlFor="clientVisible" className="text-neutral-700 font-medium">Visible to client</label>
              </div>
              <input
                type="file"
                required
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
              />
              <button type="submit" disabled={!uploadFile} className="w-full py-1.5 rounded bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

