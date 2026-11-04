'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoSwitcher from '@/components/DemoSwitcher';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
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
    // Simulate instantaneous enquiry logging for client
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      {/* Header */}
      <section className="pt-16 pb-16 md:pt-20 md:pb-20 bg-[#fbfbfc] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-semibold text-neutral-800 mb-5">
              <span>Client Advisory & Inquiries</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950">
              Contact LEGALITY
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Have questions regarding our enterprise onboarding, agreement management, or regulatory compliance workflows? Connect directly with our legal operations team.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-neutral-950">Administrative Offices</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Primary corporate headquarters and counsel chambers.
                </p>
              </div>

              <div className="space-y-5 text-xs text-neutral-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Delhi Chambers</span>
                    <span>14, Barakhamba Road, Connaught Place, New Delhi 110001, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Electronic Communication</span>
                    <a href="mailto:advisory@legality.in" className="text-neutral-900 underline">
                      advisory@legality.in
                    </a>
                    <span className="block text-[11px] text-neutral-400 mt-0.5">
                      Response window: within 4 business hours
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Direct Counsel Line</span>
                    <span>+91 11 4098 2300</span>
                    <span className="block text-[11px] text-neutral-400 mt-0.5">
                      Monday to Friday, 9:00 AM – 7:00 PM IST
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Emergency Filing Support</span>
                    <span>24/7 designated hotline for active enterprise clients with urgent statutory filings</span>
                  </div>
                </div>
              </div>

              <div className="p-5 border border-neutral-200 rounded-xl bg-neutral-50/70 text-xs text-neutral-600 space-y-1">
                <span className="font-bold text-neutral-900 block">Client Portal Access</span>
                <p>
                  Existing clients can submit requests and upload documents immediately by accessing the{' '}
                  <a href="/login" className="text-neutral-900 font-semibold underline">
                    Client Portal
                  </a>.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 md:p-10 bg-white shadow-xs">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-950">Inquiry Received</h3>
                    <p className="max-w-md mx-auto text-xs text-neutral-600 leading-relaxed">
                      Thank you for contacting LEGALITY. A member of our legal intake desk will review your details and reach out to <strong className="text-neutral-900">{formData.email}</strong> shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          organization: '',
                          category: 'MOU_AGREEMENTS',
                          message: '',
                        });
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-950 tracking-tight">
                        Send a Message to Counsel Desk
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        Fill out the preliminary details below and our team will get back to you promptly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-800 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Adv. Vikram Seth"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-800 mb-1">
                          Corporate / Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.in"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-800 mb-1">
                          Contact Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-800 mb-1">
                          Organization / Company Entity
                        </label>
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          placeholder="e.g. Apex Biotech Pvt Ltd"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Relevant Legal Practice Vertical
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      >
                        <option value="MOU_AGREEMENTS">MOUs & Bilateral Agreements</option>
                        <option value="LEGAL_DOCUMENTATION">Commercial Contracts & Documentation</option>
                        <option value="PERMISSIONS_APPROVALS">Permissions, Licences & Statutory Clearances</option>
                        <option value="LEGAL_COMPLIANCE">Corporate Compliance & Obligation Enforcement</option>
                        <option value="GENERAL">General Platform Inquiry / Enterprise Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Brief Outline of Requirements *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Provide an overview of your matter, timelines, or specific questions..."
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submitting ? 'Transmitting Details...' : 'Send Inquiry to Legal Desk'}</span>
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
      <DemoSwitcher />
    </div>
  );
}

