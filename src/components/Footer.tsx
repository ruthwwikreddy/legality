import Link from 'next/link';
import { Scale, ShieldCheck, FileCheck, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-neutral-900 flex items-center justify-center text-white">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight text-neutral-900 text-sm">LEGALITY</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              A comprehensive digital legal services and documentation platform connecting clients with specialized counsel, automated drafting, and secure digital signing.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link href="/portal/requests/new?cat=MOU_AGREEMENTS" className="hover:text-neutral-950">
                  MOUs & Agreements
                </Link>
              </li>
              <li>
                <Link href="/portal/requests/new?cat=LEGAL_DOCUMENTATION" className="hover:text-neutral-950">
                  Legal Documentation & Contracts
                </Link>
              </li>
              <li>
                <Link href="/portal/requests/new?cat=PERMISSIONS_APPROVALS" className="hover:text-neutral-950">
                  Permissions, Clearances & Licences
                </Link>
              </li>
              <li>
                <Link href="/portal/requests/new?cat=LEGAL_COMPLIANCE" className="hover:text-neutral-950">
                  Compliance Tracking & Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
              Platform & Company
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link href="/services" className="hover:text-neutral-950">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-neutral-950">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-neutral-950">
                  About LEGALITY
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-950">
                  Contact Advisory Desk
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-neutral-950">
                  Client Portal Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-neutral-950">
                  New Client Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
              Regulatory Standards
            </h4>
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                <span>IT Act 2000 Section 10A Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-neutral-700" />
                <span>SHA-256 Tamper-Evident Audit Trail</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-neutral-700" />
                <span>Advocates Act 1961 Standards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer compliant with Bar Council rules */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} LEGALITY Services. All rights reserved.</p>
          <p className="text-center md:text-right max-w-xl">
            Disclaimer: As per rules of the Bar Council of India, this technology platform does not solicit work or advertise. The information provided is intended for client workflow administration and record keeping.
          </p>
        </div>
      </div>
    </footer>
  );
}

