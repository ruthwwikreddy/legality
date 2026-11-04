'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 border border-rose-200">
        <AlertCircle className="w-6 h-6" />
      </div>
      <span className="font-mono text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">
        Execution Error
      </span>
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mb-3">
        An Unexpected Issue Occurred
      </h1>
      <p className="max-w-md text-xs sm:text-sm text-neutral-600 mb-8 leading-relaxed">
        Our system encountered an unhandled exception while executing this operation. The audit logging service has recorded this occurrence.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-semibold hover:bg-neutral-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
