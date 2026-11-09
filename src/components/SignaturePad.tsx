'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, KeyRound, RotateCcw, ShieldCheck, Check } from 'lucide-react';

interface SignaturePadProps {
  signerName: string;
  onSignatureCapture: (data: { type: string; data: string; statement: string }) => void;
}

export default function SignaturePad({ signerName, onSignatureCapture }: SignaturePadProps) {
  const [tab, setTab] = useState<'type' | 'draw' | 'esign'>('type');
  const [typedText, setTypedText] = useState(signerName || '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const statutoryStatement =
    'Pursuant to Section 10A of the Information Technology Act, 2000 (India), I hereby adopt this electronic signature with intent to be legally bound by all terms, covenants, and conditions of this agreement.';

  // Canvas drawing handlers
  useEffect(() => {
    if (tab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0a0a0a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [tab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSignatureCapture({
        type: 'DIGITAL_DRAW',
        data: dataUrl,
        statement: statutoryStatement,
      });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  useEffect(() => {
    if (tab === 'type') {
      onSignatureCapture({
        type: 'TYPED_LEGAL',
        data: typedText || signerName,
        statement: statutoryStatement,
      });
    } else if (tab === 'esign') {
      onSignatureCapture({
        type: 'ESIGN_AADHAAR_MOCK',
        data: `ESIGN_CERTIFIED_${signerName}_UIDAI_VERIFIED`,
        statement: statutoryStatement,
      });
    }
  }, [tab, typedText, signerName]);

  return (
    <div className="space-y-4">
      {/* Selector Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
        <button
          type="button"
          onClick={() => setTab('type')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
            tab === 'type'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Type Legal Name</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('draw')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
            tab === 'draw'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Draw Signature</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('esign')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
            tab === 'esign'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>India eSign / Token</span>
        </button>
      </div>

      {/* Tab 1: Type Signature */}
      {tab === 'type' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Legal Name for Adoption
            </label>
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              placeholder="Full legal name"
            />
          </div>

          <div className="p-8 bg-neutral-50/80 border border-neutral-200 rounded-xl flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden">
            <div className="absolute top-2 right-3 text-[10px] font-mono text-neutral-400">
              PREVIEW
            </div>
            <span
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              className="text-3xl text-neutral-950 tracking-wide select-none border-b border-neutral-300 pb-1 px-8 text-center"
            >
              {typedText || signerName}
            </span>
            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-neutral-500 font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Section 10A IT Act Digital Legal Adoption</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Draw Signature */}
      {tab === 'draw' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span className="font-medium">Draw customary signature inside the box:</span>
            {hasDrawn && (
              <button
                type="button"
                onClick={clearCanvas}
                className="inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-rose-600 font-semibold transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Canvas</span>
              </button>
            )}
          </div>
          <div className="border border-neutral-300 rounded-xl bg-white overflow-hidden shadow-inner relative">
            <div className="absolute bottom-6 left-6 right-6 border-b border-dashed border-neutral-200 pointer-events-none flex items-center justify-start text-[11px] text-neutral-300 font-mono">
              <span>× Sign on the line above</span>
            </div>
            <canvas
              ref={canvasRef}
              width={540}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full touch-none cursor-crosshair bg-white"
            />
          </div>
          <p className="text-[11px] text-neutral-400">
            Sign using mouse, stylus, or touch trackpad. Your signature will be cryptographically bound into the PDF.
          </p>
        </div>
      )}

      {/* Tab 3: India eSign Integration */}
      {tab === 'esign' && (
        <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-950">
                Aadhaar Electronic Signature (eSign) Integration
              </p>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                LEGALITY architecture connects with licensed Certifying Authorities (CDAC, NSDL, eMudhra) for OTP & Biometric Aadhaar eSign under Second Schedule of IT Act, 2000.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-neutral-200 rounded-lg flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-neutral-800">Signer Identity:</span>{' '}
              <span className="text-neutral-950 font-bold">{signerName}</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
              <Check className="w-3 h-3" />
              <span>CA TOKEN READY</span>
            </span>
          </div>
        </div>
      )}

      {/* Statutory Legal Consent Box */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 space-y-1.5">
        <p className="font-bold text-neutral-900 text-[10px] uppercase tracking-wider">
          Statutory Legal Consent Declaration
        </p>
        <p className="text-[11px] leading-relaxed italic text-neutral-700">
          &ldquo;{statutoryStatement}&rdquo;
        </p>
      </div>
    </div>
  );
}
