import Link from 'next/link';
import { Scale, ShieldCheck, FileCheck, Award, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center text-white shadow-xs">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold tracking-tight text-neutral-950 text-base">LEGALITY</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              Digital Legal Services Management Platform. Bridging corporate legal requirements with specialized counsel, automated drafting, and Section 10A IT Act compliant digital execution.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Practice Verticals */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 mb-3.5">
              Legal Verticals
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link href="/services#mou-agreements" className="hover:text-neutral-950 transition">
                  MOUs & Bilateral Agreements
                </Link>
              </li>
              <li>
                <Link href="/services#legal-documentation" className="hover:text-neutral-950 transition">
                  Commercial Contracts & Documentation
                </Link>
              </li>
              <li>
                <Link href="/services#permissions-approvals" className="hover:text-neutral-950 transition">
                  Permissions, Clearances & Licences
                </Link>
              </li>
              <li>
                <Link href="/services#legal-compliance" className="hover:text-neutral-950 transition">
                  Statutory Compliance & Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 mb-3.5">
              Platform & Governance
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link href="/services" className="hover:text-neutral-950 transition">
                  Practice Verticals Overview
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-neutral-950 transition">
                  Execution Workflow
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-neutral-950 transition">
                  About LEGALITY
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-950 transition">
                  Counsel Advisory Desk
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-neutral-950 transition">
                  Client Portal Sign-In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-neutral-950 transition">
                  Enterprise Client Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Statutory Compliance & Standards */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 mb-3.5">
              Statutory Architecture
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span>IT Act, 2000 Section 10A</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span>SHA-256 Cryptographic Checksums</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span>Advocates Act, 1961 Standards</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span>End-to-End Vault Access Controls</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer compliant with Bar Council rules */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} LEGALITY Platform. All rights reserved.</p>
          <p className="text-center md:text-right max-w-xl text-[10px] leading-relaxed">
            Statutory Disclaimer: As per the rules of the Bar Council of India, this technology platform does not solicit work or advertise. The information provided is strictly for workflow administration, record-keeping, and legal document coordination.
          </p>
        </div>
      </div>
    </footer>
  );
}
