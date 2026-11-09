'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Files,
  FileSignature,
  ShieldAlert,
  ClipboardCheck,
  Bell,
  Building,
  LogOut,
  Scale,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClientSidebarProps {
  user: any;
  unreadCount?: number;
}

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/portal', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Legal Matters',
    items: [
      { label: 'My Requests', href: '/portal/requests', icon: FileText },
      { label: 'Submit New Request', href: '/portal/requests/new', icon: PlusCircle },
      { label: 'Agreements & Signing', href: '/portal/agreements', icon: FileSignature },
      { label: 'Permissions & Licences', href: '/portal/permissions', icon: ShieldAlert },
    ],
  },
  {
    label: 'Records & Governance',
    items: [
      { label: 'Document Vault', href: '/portal/documents', icon: Files },
      { label: 'Compliance Ledger', href: '/portal/compliance', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Notifications', href: '/portal/notifications', icon: Bell, isNotif: true },
      { label: 'Company Profile', href: '/portal/profile', icon: Building },
    ],
  },
];

export default function ClientSidebar({ user, unreadCount = 0 }: ClientSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const orgName = user?.clientProfile?.organizationName;
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')
    : 'CL';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-neutral-900 border-r border-neutral-200/80">

      {/* Brand Header */}
      <div className="h-[64px] flex items-center justify-between px-5 border-b border-neutral-100">
        <Link href="/portal" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center shadow-xs">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black tracking-tight text-neutral-950 text-sm block leading-tight">
              LEGALITY
            </span>
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block">
              Client Portal
            </span>
          </div>
        </Link>

        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Client Identity Card */}
      <div className="px-4 py-4 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-black text-xs shrink-0 tracking-wide">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-neutral-950 truncate">{user?.fullName}</div>
            <div className="text-[11px] text-neutral-500 truncate font-medium">
              {orgName || user?.email}
            </div>
          </div>
        </div>
        {orgName && (
          <div className="mt-2.5 flex items-center gap-1.5 px-2 py-1 bg-neutral-100 rounded-lg">
            <Building className="w-3 h-3 text-neutral-500 shrink-0" />
            <span className="text-[10px] font-semibold text-neutral-600 truncate">{orgName}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/portal'
                    ? pathname === '/portal'
                    : pathname.startsWith(item.href);
                const isNew = item.href === '/portal/requests/new';

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-neutral-950 text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                        : isNew
                          ? 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-dashed border-neutral-300 hover:border-neutral-500'
                          : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-neutral-100' : 'text-neutral-500 group-hover:text-neutral-900'}`} />
                    <span className="flex-1">{item.label}</span>
                    {(item as any).isNotif && unreadCount > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md tabular-nums ${
                        isActive ? 'bg-neutral-700 text-white' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {unreadCount}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-neutral-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>Sign Out of Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top trigger */}
      <div className="md:hidden fixed top-3 left-4 z-30">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-white border border-neutral-200 rounded-xl shadow-md text-neutral-500 hover:text-neutral-900 transition"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[240px] shrink-0 min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
