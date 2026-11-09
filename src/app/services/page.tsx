import { Metadata } from 'next';
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
  Download,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Legal Services',
  description:
    'Comprehensive legal solutions: MOUs & Agreements, Commercial Contract Documentation, Permissions & Licences, and Corporate Regulatory Compliance.',
};

export default function ServicesPage() {
  const serviceCategories = [
    {
      id: 'mou-agreements',
      title: 'MOUs & Bilateral Agreements',
      categoryKey: 'MOU_AGREEMENTS',
      badge: 'Core Service Vertical',
      sla: '24-48h First Draft',
      tagline: 'Drafting, negotiating, and reviewing legally binding MOUs and bilateral instruments.',
      description:
        'From preliminary deal structures to binding cross-border arrangements, LEGALITY provides end-to-end drafting, multi-round redlining, and verified electronic execution.',
      keyCapabilities: [
        'Bilateral and multilateral Memorandums of Understanding (MOUs)',
        'Strategic partnership, joint venture, and co-development agreements',
        'Non-Disclosure Agreements (NDAs) with mutual confidentiality schedules',
        'Multi-party digital execution workflow with 6-digit access code verification',
        'Cryptographic audit certificates with SHA-256 document checksums',
      ],
      deliverables: [
        'Custom-drafted agreement in structured digital format',
        'Redlined markups during negotiation phases',
        'Audit-certified executed PDF with Section 10A IT Act compliance record',
      ],
      icon: FileSignature,
    },
    {
      id: 'legal-documentation',
      title: 'Commercial Legal Documentation',
      categoryKey: 'LEGAL_DOCUMENTATION',
      badge: 'Commercial Contracts',
      sla: '48h Turnaround',
      tagline: 'Preparation, vetting, and standardization of essential commercial contracts.',
      description:
        'Protect your commercial rights with vetted legal instruments customized to Indian corporate jurisdiction and cross-border commercial laws.',
      keyCapabilities: [
        'Master Services Agreements (MSA) and Statements of Work (SOW)',
        'Executive employment agreements, ESOP schemes, and separation deeds',
        'Vendor, supplier, distributor, and agency contracts',
        'Intellectual Property assignment agreements and software licensing',
        'Website terms of service, user privacy policies, and GDPR/DPDP notices',
      ],
      deliverables: [
        'Comprehensive contract vetting report with risk ratings',
        'Ready-to-execute fair-copy legal agreements',
        'Document version archive maintained in confidential repository',
      ],
      icon: FileText,
    },
    {
      id: 'permissions-approvals',
      title: 'Statutory Permissions & Licences',
      categoryKey: 'PERMISSIONS_APPROVALS',
      badge: 'Regulatory Clearances',
      sla: 'Dedicated Counsel Support',
      tagline: 'Assistance with licences, clearances, permits, and governmental authorisations.',
      description:
        'Navigate complex municipal, state, and central statutory regulations. Our legal team guides your filings, maintains missing document checklists, and archives official clearances.',
      keyCapabilities: [
        'Pollution Control Board (PCB) Consent to Establish (CTE) & Operate (CTO)',
        'Ministry of Corporate Affairs (MCA) entity clearances and DIN approvals',
        'FSSAI food business licensing and health trade permits',
        'Municipal corporation trade licences and factory act registrations',
        'Import-Export Code (IEC) and special economic zone (SEZ) clearances',
      ],
      deliverables: [
        'Prerequisite statutory document checklist',
        'Filing status progress tracking with milestone updates',
        'Certified digital repository of all issued permits and licences',
      ],
      icon: ShieldCheck,
    },
    {
      id: 'legal-compliance',
      title: 'Corporate Compliance & Enforcement',
      categoryKey: 'LEGAL_COMPLIANCE',
      badge: 'Statutory Governance',
      sla: 'Proactive Alerting',
      tagline: 'Corporate governance, statutory deadlines, risk mitigation, and obligation enforcement.',
      description:
        'Maintain impeccable regulatory standing. We track ongoing corporate obligations, monitor statutory deadlines, and assist in enforcing contractual covenants.',
      keyCapabilities: [
        'Digital Data Protection Act (DPDP Act, 2023) corporate compliance framework',
        'Annual corporate secretarial filings and Registrar of Companies (ROC) returns',
        'Labour law registers, POSH committee constitution, and statutory filings',
        'Contractual covenant monitoring and formal legal notice drafting',
        'Breach remediation and demand letter issuance under CPC/Arbitration frameworks',
      ],
      deliverables: [
        'Interactive compliance ledger with task-by-task checkboxes',
        'Automated deadline alerts and risk warnings prior to statutory dates',
        'Formal legal notices, replies, and compliance certificates',
      ],
      icon: ClipboardList,
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
              <span>LEGALITY Practice Verticals</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950">
              Enterprise Legal Practice Services
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              LEGALITY operates four dedicated legal practice domains designed to digitise your enterprise legal operations from intake to execution.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {serviceCategories.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                id={service.id}
                className="scroll-mt-24 border border-neutral-200/90 rounded-2xl p-6 sm:p-8 md:p-10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                  {/* Left info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="w-5 h-5 text-neutral-100" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            {service.badge}
                          </span>
                          <span className="text-neutral-300">·</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                            <Clock className="w-3 h-3" />
                            {service.sla}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-neutral-800 font-medium">
                      {service.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Key Capabilities */}
                    <div className="pt-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                        Key Capabilities & Statutory Scope
                      </h3>
                      <ul className="space-y-2">
                        {service.keyCapabilities.map((cap, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right side card */}
                  <div className="w-full lg:w-80 bg-neutral-50/70 border border-neutral-200 rounded-xl p-5 space-y-5 shrink-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2.5">
                        Typical Deliverables
                      </span>
                      <ul className="space-y-2">
                        {service.deliverables.map((item, i) => (
                          <li key={i} className="text-xs text-neutral-700 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0 mt-1.5"></span>
                            <span className="font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-neutral-200">
                      <Link
                        href={`/portal/requests/new?cat=${service.categoryKey}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm"
                      >
                        <span>Initiate Matter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <p className="text-[10px] text-neutral-400 text-center mt-2 font-mono">
                        Direct intake assignment · Attorney review
                      </p>
                    </div>
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
            <span>Enterprise Legal Operations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Streamline Your Legal Workflow?
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            Create your account today to submit service requests, upload contracts, track compliance, and sign agreements online.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-lg bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition shadow-sm"
            >
              Get Started with LEGALITY
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-lg bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition border border-neutral-800"
            >
              Contact Legal Advisory
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
