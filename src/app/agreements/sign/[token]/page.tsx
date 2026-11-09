'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Lock,
  Stamp,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import SignaturePad from '@/components/SignaturePad';

export default function AgreementSignPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [agreement, setAgreement] = useState<any>(null);
  const [activeParty, setActiveParty] = useState<any>(null);
  const [verifiedParty, setVerifiedParty] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSignModal, setShowSignModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [submittingRevision, setSubmittingRevision] = useState(false);
  const [signatureData, setSignatureData] = useState<{
    type: string;
    data: string;
    statement: string;
  } | null>(null);

  const fetchAgreement = async () => {
    try {
      const res = await fetch(`/api/agreements/sign/${token}`);
      const data = await res.json();
      if (res.ok) {
        setAgreement(data.agreement);
        if (data.activeParty) {
          setActiveParty(data.activeParty);
          setVerifiedParty(data.activeParty);
          setSelectedPartyId(data.activeParty.id);
        } else if (data.agreement.parties.length > 0) {
          setSelectedPartyId(data.agreement.parties[0].id);
        }
      } else {
        setError(data.error || 'Failed to load agreement');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreement();
  }, [token]);

  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVerifying(true);

    try {
      const res = await fetch(`/api/agreements/sign/${token}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partyId: selectedPartyId,
          accessCode: verificationCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed');
      } else {
        setVerifiedParty(data.verifiedParty);
        fetchAgreement();
      }
    } catch {
      setError('Verification network error');
    } finally {
      setVerifying(false);
    }
  };

  const handleExecuteSignature = async () => {
    if (!verifiedParty || !signatureData) return;

    setSigning(true);
    setError('');
    try {
      const res = await fetch(`/api/agreements/sign/${token}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partyId: verifiedParty.id,
          signatureType: signatureData.type,
          signatureData: signatureData.data,
          signerName: verifiedParty.name,
          signerEmail: verifiedParty.email,
          legalConsentStatement: signatureData.statement,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signature execution failed');
      } else {
        setShowSignModal(false);
        setSuccessMsg(
          data.allSigned
            ? 'Agreement successfully fully executed! Completed PDF compiled with audit certificate.'
            : 'Your signature has been registered and verified.'
        );
        fetchAgreement();
      }
    } catch {
      setError('Failed to record signature');
    } finally {
      setSigning(false);
    }
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedParty || !revisionNotes.trim()) return;

    setSubmittingRevision(true);
    setError('');
    try {
      const res = await fetch(`/api/agreements/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partyId: verifiedParty.id,
          notes: revisionNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit revision request');
      } else {
        setShowRevisionModal(false);
        setSuccessMsg('Your revision request and amendment notes have been sent to legal counsel.');
        fetchAgreement();
      }
    } catch {
      setError('Network error while requesting revisions');
    } finally {
      setSubmittingRevision(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfc] text-xs text-neutral-500">
        Loading legal agreement and verifying secure access link...
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfc] p-6 text-center">
        <div className="bg-white border border-neutral-200 rounded-xl p-8 max-w-md space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-neutral-900">Invalid or Expired Link</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {error || 'This signing link is either expired, invalid, or has been revoked.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const chosenParty = agreement.parties.find((p: any) => p.id === selectedPartyId);
  const isPartyAlreadySigned = verifiedParty && chosenParty?.status === 'SIGNED';

  return (
    <div className="min-h-screen bg-[#fbfbfc] flex flex-col text-neutral-900">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center text-white">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-neutral-900 text-xs block leading-tight">
              LEGALITY
            </span>
            <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">
              Secure Digital Signing
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded">
            {agreement.trackingNumber}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            {agreement.status.replace('_', ' ')}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Alerts */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{successMsg}</p>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Execution timestamp, telemetry, and SHA-256 certificate have been generated.
                </p>
              </div>
            </div>
            <a
              href={`/api/agreements/${agreement.id}/download`}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>
        )}

        {/* Verification Barrier: if not verified */}
        {!verifiedParty ? (
          <div className="bg-white border border-neutral-300 rounded-2xl p-8 max-w-md mx-auto shadow-md space-y-6">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800 mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-neutral-900">Signatory Identity Verification</h2>
              <p className="text-xs text-neutral-500">
                Please select your party designation and confirm your 6-digit access code to open and execute this document.
              </p>
            </div>

            <form onSubmit={handleVerifyAccess} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Select Your Signatory Identity:
                </label>
                <select
                  value={selectedPartyId}
                  onChange={(e) => setSelectedPartyId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  {agreement.parties.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.role}) - {p.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-neutral-700">
                    6-Digit Access Code
                  </label>
                  {chosenParty?.accessCode && (
                    <span className="text-[11px] text-neutral-400 font-mono">
                      (Code: <strong className="text-neutral-800">{chosenParty.accessCode}</strong>)
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit verification code"
                  className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tracking-widest text-center"
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{verifying ? 'Verifying...' : 'Verify & Open Agreement'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          /* Agreement View & Signing Section */
          <div className="space-y-8">
            {/* Top Summary & Action Bar */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500">Verified Signatory:</span>
                  <span className="font-bold text-neutral-900">{verifiedParty.name}</span>
                  <span className="text-neutral-400 font-mono">({verifiedParty.email})</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[10px]">
                    VERIFIED
                  </span>
                </div>
                <h1 className="text-lg font-bold text-neutral-950 mt-1">{agreement.title}</h1>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`/api/agreements/${agreement.id}/download`}
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 hover:border-neutral-900 text-xs font-semibold text-neutral-800 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Draft PDF</span>
                </a>

                {isPartyAlreadySigned ? (
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Signed by You</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRevisionModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 hover:border-neutral-900 text-xs font-semibold text-neutral-700 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Revisions</span>
                    </button>
                    <button
                      onClick={() => setShowSignModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition shadow-sm"
                    >
                      <Stamp className="w-4 h-4 text-amber-400" />
                      <span>Sign Agreement</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Participating Parties Ledger */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Signatories Execution Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agreement.parties.map((p: any) => {
                  const isSigned = p.status === 'SIGNED';
                  return (
                    <div
                      key={p.id}
                      className={`p-3 rounded-lg border flex items-start justify-between gap-3 text-xs ${
                        isSigned
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-neutral-200 bg-neutral-50/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-neutral-900">{p.name}</div>
                        <div className="text-[11px] text-neutral-500">
                          {p.role} {p.organization ? `· ${p.organization}` : ''}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">{p.email}</div>
                        {isSigned && p.signature && (
                          <div className="text-[10px] text-emerald-800 font-mono mt-1 pt-1 border-t border-emerald-100">
                            Signed: {new Date(p.signature.signedAt).toLocaleString()}
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                          isSigned
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Document Clauses Reader - Executive Paper Aesthetic */}
            <div className="document-paper border border-neutral-300/80 rounded-2xl p-8 sm:p-12 md:p-16 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-8 relative">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                    §
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500 block">
                      LEGALITY LEGAL ENGINES · IT ACT 2000 SEC. 10A
                    </span>
                    <span className="text-xs font-semibold text-neutral-900">
                      Executed Document Counterpart · REF: {agreement.trackingNumber}
                    </span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-[10px] font-mono font-bold">
                    OFFICIAL COUNTERPART
                  </span>
                </div>
              </div>

              <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                  FORMAL INSTRUMENT OF AGREEMENT
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-neutral-950 font-serif">
                  {agreement.title}
                </h2>
                <div className="h-0.5 w-16 bg-neutral-900 mx-auto mt-3"></div>
              </div>

              <div className="prose prose-sm max-w-none text-neutral-900 leading-relaxed font-serif whitespace-pre-wrap text-[14px] sm:text-[15px] pt-4 border-t border-neutral-100">
                {agreement.content}
              </div>

              {/* Execution Signatures Table at Bottom */}
              <div className="pt-10 border-t-2 border-neutral-200 space-y-4 font-sans">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Execution Signatures & Attestation
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Tamper-Evident SHA-256 Ledger
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agreement.parties.map((p: any) => {
                    const isSigned = p.status === 'SIGNED';
                    return (
                      <div
                        key={p.id}
                        className={`p-5 rounded-xl border space-y-3 transition ${
                          isSigned
                            ? 'border-emerald-300 bg-emerald-50/20'
                            : 'border-neutral-200 bg-neutral-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            For: {p.organization || p.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isSigned
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <div className="h-20 flex items-center justify-center border-b border-neutral-200 pb-2 bg-white rounded-lg p-2">
                          {isSigned && p.signature ? (
                            <div className="text-center space-y-1">
                              <span
                                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                                className="text-2xl text-neutral-950 select-none block"
                              >
                                {p.signature.signerName}
                              </span>
                              <span className="text-[9px] text-emerald-700 block font-mono font-semibold">
                                ✓ Certified Digital Signature · {new Date(p.signature.signedAt).toLocaleDateString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400 italic">
                              Pending Digital Signature Execution
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-neutral-600 space-y-0.5 font-mono">
                          <div>Signer: <strong className="text-neutral-900">{p.name}</strong></div>
                          <div>Role: {p.designation || p.role}</div>
                          <div>Email: {p.email}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Signature Execution Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-950">
                  Execute Digital Signature
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Signatory: {verifiedParty?.name} ({verifiedParty?.role})
                </p>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="text-xs text-neutral-400 hover:text-neutral-700"
              >
                Cancel
              </button>
            </div>

            {/* Signature Pad */}
            <SignaturePad
              signerName={verifiedParty?.name || ''}
              onSignatureCapture={(data) => setSignatureData(data)}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={signing}
                onClick={handleExecuteSignature}
                className="px-5 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                <Stamp className="w-4 h-4 text-amber-400" />
                <span>{signing ? 'Recording Signature...' : 'Adopt Signature & Execute'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-950">
                  Request Agreement Amendments
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Signatory: {verifiedParty?.name} ({verifiedParty?.organization || verifiedParty?.role})
                </p>
              </div>
              <button
                onClick={() => setShowRevisionModal(false)}
                className="text-xs text-neutral-400 hover:text-neutral-700"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleRequestRevision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Revision Comments & Requested Changes *
                </label>
                <textarea
                  required
                  rows={4}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Detail clauses that require modification, commercial adjustments, or legal clarifications..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRevision}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{submittingRevision ? 'Submitting...' : 'Submit Revision Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

