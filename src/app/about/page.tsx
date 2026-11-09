import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Scale,
  Shield,
  FileCheck,
  Lock,
  Check,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About LEGALITY',
  description:
    'Learn about LEGALITY: a modern legal operations and documentation platform built to bridge client requirements with enterprise-grade legal execution.',
};

export default function AboutPage() {
  const pillars = [
    {
      title: 'Precision in Drafting',
      description:
        'Every contract and MOU is prepared using standardized legal clauses and tailored to Indian jurisprudence and commercial enforceability.',
      icon: FileCheck,
    },
    {
      title: 'Section 10A IT Act Compliance',
      description:
        'Our digital signing framework aligns strictly with Section 10A of the Information Technology Act, 2000, creating legally enforceable electronic contracts with cryptographic audit certificates.',
      icon: Shield,
    },
    {
      title: 'Confidentiality & Privileged Access',
      description:
        'Client data is isolated with role-based access control. Documents uploaded to our secure vault are protected by strict privilege protocols.',
      icon: Lock,
    },
    {
      title: 'Real-Time Transparency',
      description:
        'No ambiguity regarding legal matters. Clients monitor real-time matter progression, review version redlines, and communicate directly with assigned attorneys.',
      icon: Scale,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-[#fbfbfc] border-b border-neutral-200 relative bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-semibold uppercase tracking-wider">
              <span>About LEGALITY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950">
              Modernising Legal Services Management
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              LEGALITY was engineered to bridge the gap between traditional legal practice and modern digital workflows — providing enterprises and founders with rapid, transparent, and legally binding operations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Purpose */}
      <section className="py-16 md:py-24 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Our Core Mission
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                Eliminating Legal Friction Through Digital Infrastructure
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Legal services historically suffer from fragmented communication, opaque turnaround times, and manual physical execution bottlenecks. LEGALITY changes this by establishing a secure digital workspace where clients and legal counsel collaborate with absolute transparency.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Whether you need a multi-party MOU executed across multiple corporate entities, comprehensive commercial contracts drafted, statutory permissions tracked, or company compliance managed — LEGALITY consolidates the complete lifecycle into one reliable platform.
              </p>
            </div>

            <div className="bg-neutral-50/70 border border-neutral-200/90 rounded-2xl p-8 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h3 className="text-base font-bold text-neutral-950">
                Core Operational Standards
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Clear, Jargon-Free Communication</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">We communicate legal assessments and contractual risks in direct, actionable language.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Cryptographically Verified Signatures</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Every executed agreement is issued with an immutable SHA-256 digital certificate and audit log.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Enterprise Accountability</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Every intake request is assigned to a designated attorney responsible for delivery and counsel updates.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 md:py-24 bg-[#fbfbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Built on Trust, Security & Compliance
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              The foundational pillars guiding our technical architecture and legal workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3 hover:border-neutral-300 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center">
                    <Icon className="w-5 h-5 text-neutral-100" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-950">{pillar.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
