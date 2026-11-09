import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  FileSignature,
  FileText,
  ShieldCheck,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  Lock,
  Stamp,
  Users2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const services = [
    {
      id: 'MOU_AGREEMENTS',
      title: 'MOUs & Agreements',
      tagline: 'Drafting, negotiation & digital signing of legally binding instruments',
      description:
        'End-to-end management of Memorandums of Understanding, Bilateral Non-Disclosure Agreements, Strategic Partnerships, and Shareholder Agreements with built-in multi-party execution.',
      features: [
        'Structured template library & custom clause authoring',
        'Multi-party digital signature workflow with email verification',
        'Tamper-evident audit trail conforming with IT Act 2000 Section 10A',
        'Cryptographic SHA-256 PDF execution certificate',
      ],
      icon: FileSignature,
      href: '/portal/requests/new?cat=MOU_AGREEMENTS',
    },
    {
      id: 'LEGAL_DOCUMENTATION',
      title: 'Legal Documentation',
      tagline: 'Bespoke commercial contracts and essential legal instruments',
      description:
        'Rigorous drafting, vetting, and redlining of Master Services Agreements, Employment contracts, Vendor Terms, Privacy Policies, and IP assignment deeds.',
      features: [
        'Client-counsel version control and change tracking',
        'Private document repository with tiered client visibility',
        'Strict confidential intake protocols and privileged access',
        'Direct communication thread with primary assigned counsel',
      ],
      icon: FileText,
      href: '/portal/requests/new?cat=LEGAL_DOCUMENTATION',
    },
    {
      id: 'PERMISSIONS_APPROVALS',
      title: 'Permissions & Approvals',
      tagline: 'Statutory licences, clearances, permits & governmental authorisations',
      description:
        'Structured tracking and advisory for industrial licences, environmental clearances (Pollution Control Board), municipal permissions, and trade authorisations.',
      features: [
        'Application checklist management with missing info alerts',
        'Progress monitoring across regulatory milestones',
        'Secure upload and archival of issued clearance certificates',
        'Direct counsel updates on statutory authority interactions',
      ],
      icon: ShieldCheck,
      href: '/portal/requests/new?cat=PERMISSIONS_APPROVALS',
    },
    {
      id: 'LEGAL_COMPLIANCE',
      title: 'Legal Compliance & Enforcement',
      tagline: 'Corporate governance, statutory deadlines & obligation enforcement',
      description:
        'Comprehensive compliance calendar management, annual corporate secretarial filings (MCA/ROC), DPDP data protection obligations, and contract covenant enforcement.',
      features: [
        'Corporate compliance ledger with itemised task checklists',
        'Automated deadline tracking with advance risk notifications',
        'Assigned compliance officers with direct accountability',
        'Statutory proof of filing and receipt archiving',
      ],
      icon: ClipboardList,
      href: '/portal/requests/new?cat=LEGAL_COMPLIANCE',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-neutral-200 bg-[#fbfbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-semibold text-neutral-800 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Enterprise Legal Operations Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.15]">
              Digital Legal Services & Documentation Management
            </h1>

            <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              LEGALITY connects clients and enterprises with dedicated legal counsel through an entirely digitized workflow: service requests, document intake, clause drafting, multi-party agreement signing, and statutory compliance tracking.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition shadow-sm"
              >
                <span>Request Legal Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 transition"
              >
                <span>Client & Staff Login</span>
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>IT Act 2000 Section 10A</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>Privileged Client Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Stamp className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>SHA-256 Audit Trail</span>
              </div>
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>Role-Based Separation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Core Practice Areas
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-1">
              Four Specialized Legal Workstreams
            </h2>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              Every practice area is backed by structured intake workflows, certified counsel review, and comprehensive audit trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="bg-white border border-neutral-200 rounded-xl p-7 flex flex-col justify-between hover:border-neutral-400 transition-all shadow-sm group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 mb-5 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-lg font-bold text-neutral-950 tracking-tight">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium mt-1">
                      {srv.tagline}
                    </p>
                    <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
                      {srv.description}
                    </p>

                    <ul className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
                      {srv.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-7 pt-5 border-t border-neutral-100">
                    <Link
                      href={srv.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Submit {srv.title} Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-[#fbfbfc] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-1">
              From Service Request to Signed Execution
            </h2>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              Transparent, accountable, and entirely paperless interaction between clients and counsel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-6 relative">
              <span className="text-3xl font-bold text-neutral-200 font-mono">01</span>
              <h4 className="text-sm font-bold text-neutral-900 mt-3">Intake & Submission</h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Client registers, selects service category, completes dynamic form, and securely uploads supporting contracts or materials.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 relative">
              <span className="text-3xl font-bold text-neutral-200 font-mono">02</span>
              <h4 className="text-sm font-bold text-neutral-900 mt-3">Counsel Assignment</h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                LEGALITY administrator reviews intake and assigns primary counsel or regulatory specialist with defined delivery milestones.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 relative">
              <span className="text-3xl font-bold text-neutral-200 font-mono">03</span>
              <h4 className="text-sm font-bold text-neutral-900 mt-3">Review & Markup</h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Counsel drafts clauses and shares marked-up drafts. Client can request revisions or submit clarification details in real time.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 relative">
              <span className="text-3xl font-bold text-neutral-200 font-mono">04</span>
              <h4 className="text-sm font-bold text-neutral-900 mt-3">Digital Execution</h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Parties receive unique verified signing links, execute digital signatures, and receive a completed PDF with an audit certificate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                About LEGALITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-1">
                Engineered for Modern Legal Integrity
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                LEGALITY was conceived to solve the fragmentation, opacity, and delays inherent in conventional legal service delivery. By pairing qualified advocates and corporate counsel with strict digital workflows, we eliminate paperwork, shorten contract turnarounds, and maintain unbroken evidentiary chains of custody.
              </p>
              <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Our agreement signing engine is explicitly built around Section 10A of the Information Technology Act, 2000, establishing electronic records and digital consents with immutable cryptographic hashes, IP telemetry, and individual party verification codes.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-neutral-800">
                <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                  <div className="font-bold text-neutral-950">Privileged Storage</div>
                  <div className="text-neutral-500 text-[11px] mt-0.5">Encrypted client document isolation</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                  <div className="font-bold text-neutral-950">Bar Council Compliant</div>
                  <div className="text-neutral-500 text-[11px] mt-0.5">Professional advocate standards</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 text-white rounded-2xl p-8 border border-neutral-800 space-y-6">
              <h3 className="text-base font-bold tracking-tight text-white">
                Platform Architecture Highlights
              </h3>

              <div className="space-y-4 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center shrink-0 text-white">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-white">Three-Tier Role-Based Separation:</span> Client Portal, Legal Counsel Console, and Administrative Platform Management.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center shrink-0 text-white">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-white">Dedicated Agreement Module:</span> Reusable templates, custom variable substitution, individual signer verification, and multi-party execution.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center shrink-0 text-white">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-white">Statutory Compliance Calendar:</span> Corporate secretarial, tax audit, environmental consents, and DPDP obligations tracking.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center shrink-0 text-white">
                    4
                  </div>
                  <div>
                    <span className="font-semibold text-white">Centralized Document Management:</span> Distinguishes client-provided evidence, working legal drafts, and finalized executed instruments.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#fbfbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-1">
              Contact Our Legal Operations Team
            </h2>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              Have questions regarding complex enterprise transactions, regulatory permissions, or custom compliance retainers?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Registered Office
              </h4>
              <p className="text-sm font-semibold text-neutral-900">
                LEGALITY Chambers & Operations
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Level 8, Supreme Legal Towers, Barakhamba Road, Connaught Place, New Delhi 110001
              </p>
            </div>

            <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Client Inquiries
              </h4>
              <p className="text-sm font-semibold text-neutral-900">
                intake@legality.in
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Direct phone: +91 11 4988 7700<br />
                Business Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST
              </p>
            </div>

            <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Quick Start
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Ready to submit an MOU, contract review, or compliance request? Register your corporate client account in two minutes.
              </p>
              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 underline hover:text-neutral-700"
                >
                  Create Client Account
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
