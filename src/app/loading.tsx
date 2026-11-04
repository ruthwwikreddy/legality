import { Scale } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center mb-4 animate-pulse">
        <Scale className="w-5 h-5" />
      </div>
      <p className="text-xs font-semibold text-neutral-500 font-mono tracking-wider">
        RETRIEVING LEGAL MATTER DATA...
      </p>
    </div>
  );
}

