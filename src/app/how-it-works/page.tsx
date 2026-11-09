import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  FileText,
  Search,
  PenTool,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  FolderLock,
  Stamp,
  Users2,
  Check,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Discover how LEGALITY digitises the legal lifecycle: from service request submission and counsel review to digital signing and ongoing regulatory compliance.',
};

export default function HowItWorksPage() {
  const workflowSteps = [
    {
      step: '01',
      title: 'Digital Intake & Structured Matter Intake',
      role: 'Client Action',
      tagline: 'Submit structured requirements in minutes through specialized intake workflows.',
      description:
        'Select your required legal vertical (MOUs, Commercial Contracts, Permissions, or Compliance). Enter contracting parties, specific commercial covenants, and upload existing working drafts or reference materials directly through your secure portal.',
      details: [
        'Custom form inputs tailored by legal service category',
        'Direct drag-and-drop supporting document uploads',
        'Automated matter tracking reference generation (e.g. REQ-2026-0005)',
      ],
      icon: FileText,
    },
    {
      step: '02',
      title: 'Counsel Assignment & Legal Review',
      role: 'Legal Team Action',
      tagline: 'Experienced attorneys analyze, vet, and draft your instruments.',
      description:
        'Our administrative console assigns your matter to an appropriate legal associate or senior counsel. The assigned attorney reviews provided facts, conducts statutory checks, drafts required clauses, and shares working drafts directly into your private portal.',
      details: [
        'Dedicated primary counsel assigned to every active matter',
        'Direct two-way messaging thread for clarification and redline discussions',
        'Private internal notes for multi-attorney collaboration',
      ],
      icon: Search,
    },
    {
      step: '03',
      title: 'Multi-Party Digital Signing & Verification',
      role: 'Collaborative Execution',
      tagline: 'Execute agreements securely with Section 10A IT Act compliance.',
      description:
        'When an MOU or contract is finalized, unique secure signing links are generated for all parties. Signatories verify their identity with access codes, review the complete contract, and execute via typed signature, drawing canvas, or eSign.',
      details: [
        '6-digit access code and email identity verification',
        'Automatic tracking of View, Review, and Signature states',
        'Audit-certified PDF generated with SHA-256 cryptographic checksums',
      ],
      icon: PenTool,
    },
    {
      step: '04',
      title: 'Vault Archival & Compliance Ledger',
      role: 'Ongoing Governance',
      tagline: 'Permanent digital records and proactive deadline tracking.',
      description:
        'Executed agreements and issued permits are archived permanently in your secure document vault. For ongoing compliance, our regulatory ledger tracks recurring statutory milestones, sending advance alerts before deadlines.',
      details: [
        'Permanent download access to signed contracts and certificates',
        'Interactive checklist for recurring statutory filings (MCA, ROC, GST)',
        'Comprehensive activity log recording every document action',
      ],
      icon: Stamp,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      {/* Header */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-[#fbfbfc] border-b border-neutral-200 relative bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-semibold uppercase tracking-wider">
              <span>Platform Workflow & Lifecycle</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950">
              How LEGALITY Works
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              A transparent, four-stage lifecycle designed to eliminate legal friction, accelerate deal execution, and maintain ongoing regulatory compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {workflowSteps.map((item, idx) => {
            const Icon = item.icon;
            const isEven = idx % 2 === 1;

            return (
              <div
                key={idx}
                className={`flex flex-col lg:flex-row items-center gap-10 md:gap-16 ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Visual / Badge Box */}
                <div className="w-full lg:w-1/2">
                  <div className="border border-neutral-200/90 rounded-2xl p-8 sm:p-10 bg-neutral-50/70 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div className="absolute top-4 right-6 text-7xl font-black text-neutral-200/70 font-mono select-none">
                      {item.step}
                    </div>
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-neutral-950 text-white flex items-center justify-center shadow-sm">
                        <Icon className="w-6 h-6 text-neutral-100" />
                      </div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-neutral-200 text-neutral-900">
                        {item.role}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {item.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Text Description */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
                      STAGE {item.step} OF 04
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">Standard SLA Enforced</span>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">
                    {item.title}
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 space-y-2.5">
                    {item.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-medium">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700">
            <span>Seamless Enterprise Onboarding</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Start Your First Legal Request Now
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            Join growing companies and legal teams managing their contracts, clearances, and compliance with LEGALITY.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-lg bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition shadow-sm"
            >
              Register Client Account
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-lg bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition border border-neutral-800"
            >
              Access Client Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
