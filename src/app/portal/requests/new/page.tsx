'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileSignature,
  FileText,
  ShieldCheck,
  ClipboardList,
  UploadCloud,
  ArrowRight,
  Check,
} from 'lucide-react';
import { SERVICE_CATEGORIES, ServiceCategory } from '@/lib/types';

function NewServiceRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCat = (searchParams.get('cat') as ServiceCategory) || 'MOU_AGREEMENTS';

  const [category, setCategory] = useState<ServiceCategory>(initialCat);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Category-specific dynamic fields
  const [mouData, setMouData] = useState({
    counterparty: '',
    purpose: '',
    dealSize: '',
    jurisdiction: 'New Delhi / Bengaluru',
    targetDate: '',
  });

  const [docData, setDocData] = useState({
    contractType: 'Master Services Agreement',
    targetAudience: 'B2B Enterprise',
    keyRisksToMitigate: '',
    jurisdiction: 'India (Arbitration Delhi)',
  });

  const [permissionData, setPermissionData] = useState({
    authorityName: 'State Pollution Control Board',
    licenceType: 'Consent to Establish (CTE)',
    siteLocation: '',
    existingLicenceNo: '',
  });

  const [complianceData, setComplianceData] = useState({
    framework: 'Ministry of Corporate Affairs (MCA)',
    financialYear: '2025-2026',
    immediateDeadline: '',
    designatedAuditor: '',
  });

  const categories = [
    {
      id: 'MOU_AGREEMENTS' as ServiceCategory,
      title: 'MOUs & Agreements',
      desc: 'Drafting & reviewing legally binding MOUs, NDAs & partnership deeds',
      icon: FileSignature,
    },
    {
      id: 'LEGAL_DOCUMENTATION' as ServiceCategory,
      title: 'Legal Documentation',
      desc: 'Bespoke commercial contracts, SaaS terms, vendor MSAs & policies',
      icon: FileText,
    },
    {
      id: 'PERMISSIONS_APPROVALS' as ServiceCategory,
      title: 'Permissions & Approvals',
      desc: 'Statutory licences, clearances, permits & governmental authorisations',
      icon: ShieldCheck,
    },
    {
      id: 'LEGAL_COMPLIANCE' as ServiceCategory,
      title: 'Legal Compliance & Enforcement',
      desc: 'Corporate secretarial filings, DPDP readiness & obligation tracking',
      icon: ClipboardList,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let dynamicData: any = {};
    if (category === 'MOU_AGREEMENTS') dynamicData = mouData;
    else if (category === 'LEGAL_DOCUMENTATION') dynamicData = docData;
    else if (category === 'PERMISSIONS_APPROVALS') dynamicData = permissionData;
    else if (category === 'LEGAL_COMPLIANCE') dynamicData = complianceData;

    try {
      // 1. Create Request
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          title,
          description,
          priority,
          dynamicData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      const newRequestId = data.request.id;

      // 2. Upload supporting file if selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('category', 'CLIENT_UPLOAD');
        formData.append('requestId', newRequestId);
        formData.append('isClientVisible', 'true');

        await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });
      }

      router.push(`/portal/requests/${newRequestId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-950">
          Submit New Legal Service Request
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Provide your matter details and upload supporting materials for legal intake review
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Category Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
            1. Select Legal Service Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((c) => {
              const Icon = c.icon;
              const isSelected = category === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`p-4 rounded-xl border text-left transition flex items-start gap-3 ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      isSelected ? 'text-white' : 'text-neutral-700'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold">{c.title}</div>
                    <div
                      className={`text-[11px] mt-1 leading-relaxed ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {c.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Matter Basics */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
            2. Matter Title & Description
          </label>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Request Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Series-A Term Sheet Review / FSSAI Central Licence Tracking"
              className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Comprehensive Matter Scope & Instructions *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your requirements, business goals, counterparties involved, and key concerns..."
              className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              >
                <option value="LOW">Low (Standard Review: 5-7 Days)</option>
                <option value="MEDIUM">Medium (Expedited: 3-5 Days)</option>
                <option value="HIGH">High (Urgent Commercial: 1-2 Days)</option>
                <option value="URGENT">Urgent (Immediate Intake: 24 Hours)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Dynamic Category-Specific Form */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
            3. Specific Intake Information ({category.replace('_', ' ')})
          </label>

          {/* MOU & Agreements dynamic fields */}
          {category === 'MOU_AGREEMENTS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Counterparty Legal Name
                </label>
                <input
                  type="text"
                  value={mouData.counterparty}
                  onChange={(e) => setMouData({ ...mouData, counterparty: e.target.value })}
                  placeholder="e.g. Vertex Capital Partners LLC"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Estimated Transaction / Deal Size
                </label>
                <input
                  type="text"
                  value={mouData.dealSize}
                  onChange={(e) => setMouData({ ...mouData, dealSize: e.target.value })}
                  placeholder="e.g. INR 2.5 Crores / USD $500,000"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Governing Jurisdiction & Court
                </label>
                <input
                  type="text"
                  value={mouData.jurisdiction}
                  onChange={(e) => setMouData({ ...mouData, jurisdiction: e.target.value })}
                  placeholder="e.g. New Delhi, India"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Target Execution Date
                </label>
                <input
                  type="date"
                  value={mouData.targetDate}
                  onChange={(e) => setMouData({ ...mouData, targetDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Legal Documentation dynamic fields */}
          {category === 'LEGAL_DOCUMENTATION' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Contract Sub-Type
                </label>
                <select
                  value={docData.contractType}
                  onChange={(e) => setDocData({ ...docData, contractType: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white"
                >
                  <option value="Master Services Agreement">Master Services Agreement (MSA)</option>
                  <option value="SaaS Terms of Service & DPA">SaaS Terms of Service & DPA</option>
                  <option value="Employment & IP Assignment Agreement">Employment & IP Assignment</option>
                  <option value="Commercial Vendor Contract">Commercial Vendor Contract</option>
                  <option value="Non-Compete & Non-Disclosure">Non-Compete & Non-Disclosure</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Target Counterparty Type
                </label>
                <input
                  type="text"
                  value={docData.targetAudience}
                  onChange={(e) => setDocData({ ...docData, targetAudience: e.target.value })}
                  placeholder="e.g. B2B Enterprise / Direct Consumer"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Key Risk Points to Mitigate
                </label>
                <input
                  type="text"
                  value={docData.keyRisksToMitigate}
                  onChange={(e) => setDocData({ ...docData, keyRisksToMitigate: e.target.value })}
                  placeholder="e.g. Limitation of liability cap, IP indemnity carve-outs, 30-day payment term"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Permissions & Approvals dynamic fields */}
          {category === 'PERMISSIONS_APPROVALS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Statutory Department / Authority
                </label>
                <input
                  type="text"
                  value={permissionData.authorityName}
                  onChange={(e) =>
                    setPermissionData({ ...permissionData, authorityName: e.target.value })
                  }
                  placeholder="e.g. State Pollution Control Board, FSSAI, PESO"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Licence / Clearance Category
                </label>
                <input
                  type="text"
                  value={permissionData.licenceType}
                  onChange={(e) =>
                    setPermissionData({ ...permissionData, licenceType: e.target.value })
                  }
                  placeholder="e.g. Consent to Establish (Orange/Red Category)"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Premises / Plant Location
                </label>
                <input
                  type="text"
                  value={permissionData.siteLocation}
                  onChange={(e) =>
                    setPermissionData({ ...permissionData, siteLocation: e.target.value })
                  }
                  placeholder="Industrial Area, Survey Plot, City, State"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Legal Compliance dynamic fields */}
          {category === 'LEGAL_COMPLIANCE' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Regulatory Framework
                </label>
                <input
                  type="text"
                  value={complianceData.framework}
                  onChange={(e) =>
                    setComplianceData({ ...complianceData, framework: e.target.value })
                  }
                  placeholder="e.g. MCA Companies Act 2013 / DPDP Act 2023"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Financial Year / Reporting Cycle
                </label>
                <input
                  type="text"
                  value={complianceData.financialYear}
                  onChange={(e) =>
                    setComplianceData({ ...complianceData, financialYear: e.target.value })
                  }
                  placeholder="e.g. FY 2025-26"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Critical Filing Deadline
                </label>
                <input
                  type="date"
                  value={complianceData.immediateDeadline}
                  onChange={(e) =>
                    setComplianceData({ ...complianceData, immediateDeadline: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Supporting Document Upload */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
            4. Supporting Documents (Optional)
          </label>
          <p className="text-xs text-neutral-500">
            Upload prior contracts, draft clauses, certificates of incorporation, or regulatory letters.
          </p>

          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-neutral-500 transition-colors">
            <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <div className="text-xs text-neutral-700 font-medium">
              {file ? (
                <span className="text-emerald-700 font-bold">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
              ) : (
                'Choose a file to attach to this request'
              )}
            </div>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-3 text-xs text-neutral-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{loading ? 'Submitting Service Request...' : 'Submit Service Request for Review'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewServiceRequestPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">Loading form...</div>}>
      <NewServiceRequestForm />
    </Suspense>
  );
}

