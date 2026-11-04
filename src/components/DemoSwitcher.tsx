'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Briefcase, User, Sparkles, Check, ChevronDown } from 'lucide-react';

const ROLES = [
  {
    key: 'admin',
    label: 'Administrator',
    email: 'admin@legality.in',
    icon: Shield,
    role: 'ADMIN',
    badge: 'Managing Partner',
  },
  {
    key: 'counsel',
    label: 'Senior Legal Counsel',
    email: 'counsel@legality.in',
    icon: Briefcase,
    role: 'EMPLOYEE',
    badge: 'Adv. Ananya Deshmukh',
  },
  {
    key: 'associate',
    label: 'Compliance Associate',
    email: 'associate@legality.in',
    icon: Briefcase,
    role: 'EMPLOYEE',
    badge: 'Rohan Mehra',
  },
  {
    key: 'client1',
    label: 'Client: TechCorp Solutions',
    email: 'client@techcorp.in',
    icon: User,
    role: 'CLIENT',
    badge: 'Rajesh Sharma (MD)',
  },
  {
    key: 'client2',
    label: 'Client: Innovate BioLabs',
    email: 'client@innovate.in',
    icon: User,
    role: 'CLIENT',
    badge: 'Dr. Priya Nambiar',
  },
];

export default function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSwitch = async (roleKey: string) => {
    try {
      setLoading(roleKey);
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleKey }),
      });
      const data = await res.json();
      if (data.success) {
        setOpen(false);
        router.push(data.redirectTo);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold shadow-lg hover:bg-neutral-800 transition-all border border-neutral-700"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Role Switcher (Demo)</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute bottom-12 right-0 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 p-2.5 space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-2.5 py-1.5 border-b border-neutral-100 mb-1">
              <p className="text-xs font-semibold text-neutral-900">Switch Evaluation Role</p>
              <p className="text-[11px] text-neutral-500">
                Instantly switch persona to test role-based access & permissions.
              </p>
            </div>

            {ROLES.map((r) => {
              const Icon = r.icon;
              const isLoadingThis = loading === r.key;
              return (
                <button
                  key={r.key}
                  disabled={loading !== null}
                  onClick={() => handleSwitch(r.key)}
                  className="w-full text-left p-2 rounded-lg hover:bg-neutral-100 flex items-start gap-2.5 transition text-xs group disabled:opacity-50"
                >
                  <div className="p-1.5 rounded bg-neutral-100 group-hover:bg-neutral-200 text-neutral-700">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900">{r.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                        {r.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">{r.badge} · {r.email}</p>
                  </div>
                  {isLoadingThis && <span className="text-[10px] text-neutral-400 self-center">...</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

