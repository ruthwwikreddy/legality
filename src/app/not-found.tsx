import Link from 'next/link';
import { Scale, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-6">
        <Scale className="w-6 h-6" />
      </div>
      <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
        404 — Record Not Located
      </span>
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mb-3">
        Page or Matter Not Found
      </h1>
      <p className="max-w-md text-xs sm:text-sm text-neutral-600 mb-8 leading-relaxed">
        The legal document, portal page, or tracking reference you requested does not exist or has been relocated within the LEGALITY system.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/portal"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-semibold hover:bg-neutral-200 transition"
        >
          <span>Client Portal</span>
        </Link>
      </div>
    </div>
  );
}

