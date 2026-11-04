'use client';

import { useState, useEffect } from 'react';
import {
  FolderLock,
  Download,
  UploadCloud,
  FileText,
  Search,
  Filter,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { DOCUMENT_CATEGORY_LABELS, DocumentCategory } from '@/lib/types';

export default function ClientDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ALL' | 'CLIENT' | 'LEGAL'>('ALL');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.documents) setDocuments(data.documents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      formData.append('category', 'CLIENT_UPLOAD');
      formData.append('isClientVisible', 'true');

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMsg('Document uploaded to your vault.');
        setShowUpload(false);
        setFile(null);
        setTitle('');
        fetchDocs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (tab === 'CLIENT' && doc.category !== 'CLIENT_UPLOAD') return false;
    if (tab === 'LEGAL' && doc.category === 'CLIENT_UPLOAD') return false;
    if (search) {
      const matchTitle = doc.title.toLowerCase().includes(search.toLowerCase());
      const matchFile = doc.fileName.toLowerCase().includes(search.toLowerCase());
      return matchTitle || matchFile;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            Document Repository & Vault
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Access, download, and manage your uploaded records and documents prepared by LEGALITY
          </p>
        </div>

        <button
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm self-start sm:self-auto"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          {msg}
        </div>
      )}

      {/* Upload Modal / Form */}
      {showUpload && (
        <div className="bg-white border border-neutral-300 rounded-xl p-6 shadow-md space-y-4 animate-in fade-in duration-150">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Upload New Document to Repository
            </h3>
            <button
              onClick={() => setShowUpload(false)}
              className="text-xs text-neutral-400 hover:text-neutral-700"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Audited Financial Statements FY 2025-26"
                className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Select File (PDF, DOCX, ZIP - Max 25MB)
              </label>
              <input
                type="file"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-neutral-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="py-2 px-4 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Save to Vault'}
            </button>
          </form>
        </div>
      )}

      {/* Controls: Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex border border-neutral-200 rounded-lg bg-white p-1 self-start">
          <button
            onClick={() => setTab('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              tab === 'ALL' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Documents ({documents.length})
          </button>
          <button
            onClick={() => setTab('CLIENT')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              tab === 'CLIENT' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            My Uploads
          </button>
          <button
            onClick={() => setTab('LEGAL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              tab === 'LEGAL' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Shared by LEGALITY
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document name or file..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Document Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">
          Loading repository records...
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <FolderLock className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No documents found</h3>
          <p className="text-xs text-neutral-500">
            No files currently match your filter or search criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Document Details</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Related Request</th>
                  <th className="px-5 py-3.5">Uploaded By</th>
                  <th className="px-5 py-3.5">Date & Size</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredDocs.map((doc) => {
                  const catLabel =
                    DOCUMENT_CATEGORY_LABELS[doc.category as DocumentCategory] || doc.category;
                  const isClientUpload = doc.category === 'CLIENT_UPLOAD';

                  return (
                    <tr key={doc.id} className="hover:bg-neutral-50/70 transition">
                      <td className="px-5 py-4">
                        <div className="font-bold text-neutral-900 truncate max-w-xs">{doc.title}</div>
                        <div className="text-[11px] text-neutral-400 font-mono truncate">{doc.fileName}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            isClientUpload
                              ? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {catLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {doc.request ? (
                          <div className="space-y-0.5">
                            <span className="font-mono text-[11px] text-neutral-600 block">
                              {doc.request.trackingNumber}
                            </span>
                            <span className="text-[11px] text-neutral-500 truncate block max-w-[150px]">
                              {doc.request.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">General Vault</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-neutral-800">{doc.uploadedBy.fullName}</span>
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {doc.uploadedBy.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-neutral-700 block">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {(doc.fileSize / 1024).toFixed(0)} KB
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={`/api/documents/${doc.id}/download`}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-semibold transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
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

