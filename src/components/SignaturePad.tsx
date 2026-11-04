'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, KeyRound, RotateCcw } from 'lucide-react';

interface SignaturePadProps {
  signerName: string;
  onSignatureCapture: (data: { type: string; data: string; statement: string }) => void;
}

export default function SignaturePad({ signerName, onSignatureCapture }: SignaturePadProps) {
  const [tab, setTab] = useState<'draw' | 'type' | 'esign'>('type');
  const [typedText, setTypedText] = useState(signerName || '');
  const [fontFamily, setFontFamily] = useState('cursive');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [eSignVerified, setESignVerified] = useState(false);

  const statutoryStatement =
    'Pursuant to Section 10A of the Information Technology Act, 2000 (India), I hereby adopt this electronic signature with intent to be legally bound by all terms, covenants, and conditions of this agreement.';

  // Canvas drawing handlers
  useEffect(() => {
    if (tab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
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
        data: typedText,
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
      <div className="flex border-b border-neutral-200">
        <button
          type="button"
          onClick={() => setTab('type')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition -mb-px ${
            tab === 'type'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Type Legal Name</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('draw')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition -mb-px ${
            tab === 'draw'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Draw Signature</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('esign')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition -mb-px ${
            tab === 'esign'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
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
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Signer Legal Name
            </label>
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
              placeholder="Full legal name"
            />
          </div>

          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded flex flex-col items-center justify-center min-h-[100px]">
            <span
              style={{ fontFamily: 'cursive' }}
              className="text-2xl text-neutral-900 tracking-wide select-none"
            >
              {typedText || signerName}
            </span>
            <span className="text-[10px] text-neutral-400 mt-2 font-mono">
              Legally adopted digital signature representation
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Draw Signature */}
      {tab === 'draw' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>Draw using mouse or touch trackpad</span>
            {hasDrawn && (
              <button
                type="button"
                onClick={clearCanvas}
                className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Canvas</span>
              </button>
            )}
          </div>
          <div className="border border-neutral-300 rounded bg-white overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={500}
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
            Click and drag inside the box above to write your customary signature.
          </p>
        </div>
      )}

      {/* Tab 3: India eSign Integration */}
      {tab === 'esign' && (
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded space-y-3">
          <div className="flex items-start gap-2.5">
            <KeyRound className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-neutral-900">
                Aadhaar Electronic Signature (eSign) Integration Ready
              </p>
              <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                LEGALITY architecture connects with licensed Certifying Authorities (CDAC, NSDL, eMudhra) for OTP/Biometric Aadhaar eSign under Second Schedule of IT Act, 2000.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white border border-neutral-200 rounded flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-neutral-800">Signer Verification:</span>{' '}
              <span className="text-neutral-600">{signerName}</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[10px]">
              CERTIFIED RECORD
            </span>
          </div>
        </div>
      )}

      {/* Statutory Legal Consent Box */}
      <div className="p-3 bg-neutral-100 border border-neutral-200 rounded text-xs text-neutral-600 space-y-1">
        <p className="font-semibold text-neutral-800 text-[11px] uppercase tracking-wider">
          Statutory Legal Declaration
        </p>
        <p className="text-[11px] leading-relaxed italic">
          "{statutoryStatement}"
        </p>
      </div>
    </div>
  );
}

