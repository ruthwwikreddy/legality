'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FolderLock,
  Upload,
  Download,
  Search,
  X,
  Plus,
  FileText,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_LABELS,
  DocumentCategory,
} from '@/lib/types';

interface DocumentRecord {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: DocumentCategory;
  isClientVisible: boolean;
  clientId: string | null;
  requestId: string | null;
  createdAt: string;
  uploadedBy: { fullName: string };
  request: { trackingNumber: string; title: string } | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const CATEGORY_STYLES: Record<DocumentCategory, { color: string; bg: string }> = {
  CLIENT_UPLOAD: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  LEGAL_DRAFT: { color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  FINAL_EXECUTED: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  APPROVAL_PERMIT: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  COMPLIANCE_FILING: { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('CLIENT_UPLOAD');
  const [uploadVisible, setUploadVisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set('category', categoryFilter);
      if (searchTerm) params.set('search', searchTerm);
      const res = await fetch(`/api/documents?${params.toString()}`);
      const data = await res.json();
      if (data.documents) setDocuments(data.documents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadTitle.trim()) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadTitle.trim());
      formData.append('category', uploadCategory);
      formData.append('isClientVisible', uploadVisible ? 'true' : 'false');

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed');
      } else {
        setShowUploadForm(false);
        setUploadTitle('');
        setUploadCategory('CLIENT_UPLOAD');
        setUploadVisible(true);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await fetchDocuments();
      }
    } catch {
      setUploadError('An unexpected error occurred.');
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = documents.filter((d) =>
    searchTerm
      ? d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center border border-neutral-200">
            <FolderLock className="w-4.5 h-4.5 text-neutral-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-950">Document Repository</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {loading ? 'Loading…' : `${documents.length} document${documents.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowUploadForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition"
        >
          {showUploadForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showUploadForm ? 'Cancel Upload' : 'Upload New Document'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900 mb-5 flex items-center gap-2">
            <Upload className="w-4 h-4 text-neutral-500" />
            Upload New Document
          </h2>
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                File <span className="text-rose-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                required
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className="w-full text-xs text-neutral-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-800 hover:file:bg-neutral-200 border border-neutral-300 rounded-lg px-2 py-1.5 bg-white"
              />
              {selectedFile && (
                <p className="text-[11px] text-neutral-500 mt-1">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. MoU Draft v2 – Client Corp"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900 pr-8"
                >
                  {Object.entries(DOCUMENT_CATEGORIES).map(([key, val]) => (
                    <option key={key} value={val}>
                      {DOCUMENT_CATEGORY_LABELS[val]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Client Visible */}
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                id="clientVisible"
                type="checkbox"
                checked={uploadVisible}
                onChange={(e) => setUploadVisible(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <label htmlFor="clientVisible" className="text-xs font-medium text-neutral-700 cursor-pointer">
                Visible to client
              </label>
              <span className="text-[11px] text-neutral-400">(client can download this document from their portal)</span>
            </div>

            {uploadError && (
              <div className="md:col-span-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {uploadError}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Uploading…' : 'Upload Document'}
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
            placeholder="Search by title or file name…"
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </form>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="">All Categories</option>
            {Object.entries(DOCUMENT_CATEGORIES).map(([key, val]) => (
              <option key={key} value={val}>
                {DOCUMENT_CATEGORY_LABELS[val]}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading documents…</div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-14 text-center space-y-3">
          <FileText className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No documents found</h3>
          <p className="text-xs text-neutral-500">Upload a document or adjust the filters above.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Title</th>
                  <th className="px-5 py-3.5">File Name</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Size</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Client Visible</th>
                  <th className="px-5 py-3.5">Related Request</th>
                  <th className="px-5 py-3.5">Uploaded By</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredDocs.map((doc) => {
                  const catStyle = CATEGORY_STYLES[doc.category] ?? {
                    color: 'text-neutral-700',
                    bg: 'bg-neutral-100 border-neutral-300',
                  };
                  return (
                    <tr key={doc.id} className="hover:bg-neutral-50/60 transition">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-neutral-900 block max-w-[180px] truncate" title={doc.title}>
                          {doc.title}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[10px] text-neutral-600 block max-w-[160px] truncate" title={doc.fileName}>
                          {doc.fileName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase">
                          {doc.fileType.split('/')[1] || doc.fileType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600 whitespace-nowrap">
                        {formatFileSize(doc.fileSize)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${catStyle.bg} ${catStyle.color}`}
                        >
                          {DOCUMENT_CATEGORY_LABELS[doc.category]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {doc.isClientVisible ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <Eye className="w-3 h-3" /> Visible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                            <EyeOff className="w-3 h-3" /> Hidden
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {doc.request ? (
                          <span className="block">
                            <span className="font-mono text-[10px] text-neutral-500 font-bold block">
                              {doc.request.trackingNumber}
                            </span>
                            <span className="text-[10px] text-neutral-700 max-w-[140px] block truncate" title={doc.request.title}>
                              {doc.request.title}
                            </span>
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-700 font-medium whitespace-nowrap">
                        {doc.uploadedBy.fullName}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-500 whitespace-nowrap">
                        {new Date(doc.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <a
                          href={`/api/documents/${doc.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 text-[11px] font-semibold rounded-lg transition"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </a>
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
