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
                  <button
                    onClick={() => setShowSignModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition shadow-sm"
                  >
                    <Stamp className="w-4 h-4 text-amber-400" />
                    <span>Sign Agreement</span>
                  </button>
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

            {/* Document Clauses Reader */}
            <div className="bg-white border border-neutral-200 rounded-xl p-8 sm:p-12 shadow-sm space-y-6">
              <div className="border-b border-neutral-200 pb-4 text-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                  LEGALITY PLATFORM · IT ACT 2000 SECTION 10A EXECUTABLE DOCUMENT
                </span>
                <h2 className="text-xl font-bold uppercase tracking-wide text-neutral-900 mt-2 font-serif">
                  {agreement.title}
                </h2>
              </div>

              <div className="prose prose-sm max-w-none text-neutral-800 leading-relaxed font-serif whitespace-pre-wrap text-sm">
                {agreement.content}
              </div>

              {/* Execution Signatures Table at Bottom */}
              <div className="pt-8 border-t border-neutral-300 space-y-4 font-sans">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Signatures & Counterparts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agreement.parties.map((p: any) => {
                    const isSigned = p.status === 'SIGNED';
                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2"
                      >
                        <div className="text-xs font-bold text-neutral-900">
                          For: {p.organization || p.name}
                        </div>
                        <div className="h-16 flex items-center justify-center border-b border-neutral-200 pb-2">
                          {isSigned && p.signature ? (
                            <div className="text-center">
                              <span
                                style={{ fontFamily: 'cursive' }}
                                className="text-xl text-neutral-900 select-none"
                              >
                                {p.signature.signerName}
                              </span>
                              <span className="text-[9px] text-emerald-700 block font-mono">
                                [Digital Signature Timestamp Verified]
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400 italic">
                              Pending Digital Signature Execution
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-600 space-y-0.5">
                          <div>Name: {p.name}</div>
                          <div>Designation: {p.designation || p.role}</div>
                          <div>Status: <strong className={isSigned ? 'text-emerald-700' : 'text-amber-700'}>{p.status}</strong></div>
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
    </div>
  );
}

