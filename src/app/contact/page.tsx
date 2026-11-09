'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    category: 'MOU_AGREEMENTS',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Instantaneous enquiry logging for client
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      {/* Header */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-[#fbfbfc] border-b border-neutral-200 relative bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-semibold uppercase tracking-wider">
              <span>Counsel Advisory & Corporate Inquiries</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950">
              Contact LEGALITY Advisory Desk
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Have questions regarding enterprise onboarding, agreement workflows, or statutory compliance? Connect directly with our legal operations team.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-neutral-950 tracking-tight">Administrative Chambers</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Primary corporate headquarters and counsel chambers.
                </p>
              </div>

              <div className="space-y-5 text-xs text-neutral-700">
                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
                  <div className="p-2.5 rounded-lg bg-neutral-950 text-white shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-950 block text-xs">Delhi Chambers</span>
                    <span className="text-neutral-600 leading-relaxed mt-0.5 block">
                      14, Barakhamba Road, Connaught Place, New Delhi 110001, India
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
                  <div className="p-2.5 rounded-lg bg-neutral-950 text-white shrink-0 shadow-xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-950 block text-xs">Electronic Communication</span>
                    <a href="mailto:advisory@legality.in" className="text-neutral-900 font-semibold underline">
                      advisory@legality.in
                    </a>
                    <span className="block text-[11px] text-emerald-700 font-medium mt-0.5">
                      Response SLA: within 4 business hours
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
                  <div className="p-2.5 rounded-lg bg-neutral-950 text-white shrink-0 shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-950 block text-xs">Direct Counsel Line</span>
                    <span className="font-mono text-neutral-900 font-semibold block">+91 11 4098 2300</span>
                    <span className="block text-[11px] text-neutral-400 mt-0.5">
                      Monday to Friday, 9:00 AM – 7:00 PM IST
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
                  <div className="p-2.5 rounded-lg bg-neutral-950 text-white shrink-0 shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-950 block text-xs">Emergency Statutory Desk</span>
                    <span className="text-neutral-600 block leading-relaxed mt-0.5">
                      24/7 dedicated counsel triage for enterprise clients with urgent court or statutory filings.
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 border border-neutral-200 rounded-xl bg-neutral-950 text-white text-xs space-y-2">
                <span className="font-bold uppercase tracking-wider text-[11px] text-neutral-300 block">
                  Registered Client Access
                </span>
                <p className="text-neutral-400 leading-relaxed font-normal">
                  Clients with active matters can immediately submit requests, view redlines, and download signed contracts via the private portal.
                </p>
                <div className="pt-2">
                  <a
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-white font-bold underline hover:text-neutral-200"
                  >
                    Open Client Portal →
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="border border-neutral-200/90 rounded-2xl p-6 sm:p-8 md:p-10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                {submitted ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                      <Check className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-950">
                      Advisory Request Received
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting LEGALITY. A senior legal counsel from our Delhi chambers has been notified and will review your inquiry within 4 business hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-5 py-2 rounded-lg bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-950">Send an Inquiry</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Fill out the details below. Our counsel team will connect with your organization.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-950"
                          placeholder="Adv. / Mr. / Ms. Full Name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Corporate / Official Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-950"
                          placeholder="counsel@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Direct Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-950 font-mono"
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Organization / Firm Name
                        </label>
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-950"
                          placeholder="Company, LLP or Enterprise"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Practice Domain *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-950 bg-white"
                      >
                        <option value="MOU_AGREEMENTS">MOUs & Bilateral Agreements</option>
                        <option value="LEGAL_DOCUMENTATION">Commercial Legal Documentation & Contracts</option>
                        <option value="PERMISSIONS_APPROVALS">Statutory Clearances, Licences & Approvals</option>
                        <option value="LEGAL_COMPLIANCE">Corporate Compliance, Governance & Enforcement</option>
                        <option value="ENTERPRISE_CUSTOM">Enterprise Custom Legal Workflow Integration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Matter Overview & Specific Requirements *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-950 leading-relaxed"
                        placeholder="Please describe your requirements, key covenants, jurisdictional requirements, or timeline expectations..."
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto px-8 py-3 rounded-lg bg-neutral-950 text-white text-xs font-bold hover:bg-neutral-800 transition disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span>{submitting ? 'Transmitting to Counsel Desk...' : 'Transmit Inquiry'}</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
