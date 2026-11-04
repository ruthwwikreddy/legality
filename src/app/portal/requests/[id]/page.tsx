'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FileText,
  Clock,
  User,
  ArrowLeft,
  Send,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  FileSignature,
  FileCheck,
} from 'lucide-react';
import {
  REQUEST_STATUS_LABELS,
  SERVICE_CATEGORY_LABELS,
  RequestStatus,
  ServiceCategory,
} from '@/lib/types';

export default function ClientRequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/requests/${requestId}`);
      const data = await res.json();
      if (data.request) {
        setRequest(data.request);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSendingReply(true);
    setFeedback('');
    try {
      const res = await fetch(`/api/requests/${requestId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyMessage('');
        setFeedback('Response submitted to assigned counsel.');
        fetchRequest();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setFeedback('');
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadFile.name);
      formData.append('requestId', requestId);
      formData.append('category', 'CLIENT_UPLOAD');
      formData.append('isClientVisible', 'true');

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadFile(null);
        setFeedback('Document uploaded successfully.');
        fetchRequest();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-neutral-500">
        Loading matter details...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-xs text-neutral-500">Request not found or access restricted.</p>
        <Link href="/portal/requests" className="text-xs underline font-semibold text-neutral-900">
          Back to all requests
        </Link>
      </div>
    );
  }

  const statusStyle =
    REQUEST_STATUS_LABELS[request.status as RequestStatus] || {
      label: request.status,
      color: 'text-neutral-700',
      bg: 'bg-neutral-50 border-neutral-200',
    };
  const catLabel =
    SERVICE_CATEGORY_LABELS[request.category as ServiceCategory]?.label || request.category;
  const assignedCounsel = request.assignments?.[0]?.employee;

  let dynamicParsed: any = null;
  try {
    if (request.dynamicData) dynamicParsed = JSON.parse(request.dynamicData);
  } catch {}

  const statusSteps = [
    'SUBMITTED',
    'UNDER_REVIEW',
    'IN_PROGRESS',
    'AWAITING_APPROVAL',
    'COMPLETED',
  ];
  const currentStepIdx = statusSteps.indexOf(request.status);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/portal/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Requests</span>
        </Link>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          {feedback}
        </div>
      )}

      {/* Main Request Header Card */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-neutral-800">
                {request.trackingNumber}
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                {catLabel}
              </span>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.color}`}
              >
                {statusStyle.label}
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-50 border border-neutral-200 text-neutral-600">
                {request.priority} PRIORITY
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
              {request.title}
            </h1>
          </div>

          <div className="text-left sm:text-right shrink-0 text-xs text-neutral-400">
            <div>Submitted {new Date(request.createdAt).toLocaleDateString()}</div>
            {request.estimatedCompletion && (
              <div className="text-neutral-700 font-medium mt-1">
                Target: {new Date(request.estimatedCompletion).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div className="pt-4 border-t border-neutral-100">
          <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-semibold">
            {statusSteps.map((step, idx) => {
              const isPast = currentStepIdx >= idx || request.status === 'COMPLETED';
              const isCurrent = request.status === step;
              return (
                <div key={step} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full ${
                      isPast
                        ? 'bg-neutral-900'
                        : isCurrent
                        ? 'bg-indigo-600 animate-pulse'
                        : 'bg-neutral-200'
                    }`}
                  />
                  <span
                    className={
                      isCurrent
                        ? 'text-neutral-900 font-bold'
                        : isPast
                        ? 'text-neutral-700'
                        : 'text-neutral-400'
                    }
                  >
                    {step.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description Body */}
        <div className="bg-neutral-50/70 border border-neutral-100 rounded-lg p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            Scope & Instructions
          </h4>
          <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
            {request.description}
          </p>
        </div>

        {/* Dynamic metadata if present */}
        {dynamicParsed && (
          <div className="border border-neutral-200 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Service Intake Metadata
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {Object.entries(dynamicParsed).map(([k, v]) => (
                <div key={k} className="p-2 bg-neutral-50 rounded">
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-semibold text-neutral-800">
                    {Array.isArray(v) ? v.join(', ') : String(v)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Updates Thread & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Updates & Communication Thread */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
              Communication & Status History
            </h3>

            {/* Updates list */}
            <div className="space-y-4">
              {request.updates?.map((u: any) => (
                <div key={u.id} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">{u.author.fullName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 font-mono">
                        {u.author.role}
                      </span>
                      {u.status && (
                        <span className="text-[10px] text-indigo-700 font-semibold font-mono">
                          [{u.status}]
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(u.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {u.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Post Client Reply Box */}
            <form onSubmit={handlePostReply} className="pt-4 border-t border-neutral-100 space-y-3">
              <label className="block text-xs font-semibold text-neutral-800">
                Reply or Submit Additional Clarification
              </label>
              <textarea
                rows={3}
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response to the legal team or provide requested information..."
                className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingReply ? 'Posting...' : 'Send Update to Counsel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (1 Col): Assigned Counsel & Documents */}
        <div className="space-y-6">
          {/* Assigned Counsel Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Assigned Legal Counsel
            </h4>
            {assignedCounsel ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                    {assignedCounsel.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      {assignedCounsel.fullName}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {assignedCounsel.employeeProfile?.designation || 'Primary Legal Counsel'}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-600 space-y-1">
                  <div>Department: {assignedCounsel.employeeProfile?.department || 'Corporate Practice'}</div>
                  {assignedCounsel.employeeProfile?.barCouncilNumber && (
                    <div className="font-mono text-neutral-500">
                      Bar Enrolment: {assignedCounsel.employeeProfile.barCouncilNumber}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded text-xs text-amber-800">
                Awaiting assignment by managing partner. You will receive an alert once primary counsel is assigned.
              </div>
            )}
          </div>

          {/* Matter Documents */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Matter Documents ({request.documents?.length || 0})
              </h4>
            </div>

            {/* List */}
            <div className="space-y-2">
              {request.documents?.length === 0 ? (
                <p className="text-xs text-neutral-400">No documents attached yet.</p>
              ) : (
                request.documents?.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">{doc.title}</p>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {(doc.fileSize / 1024).toFixed(0)} KB · {doc.category}
                      </span>
                    </div>

                    <a
                      href={`/api/documents/${doc.id}/download`}
                      download
                      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))
              )}
            </div>

            {/* Upload another file */}
            <form onSubmit={handleFileUpload} className="pt-3 border-t border-neutral-100 space-y-2">
              <label className="block text-[11px] font-semibold text-neutral-700">
                Attach Additional Document
              </label>
              <input
                type="file"
                required
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer w-full"
              />
              <button
                type="submit"
                disabled={!uploadFile || uploading}
                className="w-full py-1.5 px-3 rounded bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

