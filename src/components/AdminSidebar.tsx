'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileSignature,
  FolderLock,
  Users,
  Briefcase,
  ShieldAlert,
  ScrollText,
  LogOut,
  Scale,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  user: any;
  counts?: {
    newRequests: number;
    pendingSignatures: number;
  };
}

const navGroups = [
  {
    label: 'Command Centre',
    items: [
      { label: 'Operations Overview', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Legal Operations',
    items: [
      { label: 'All Requests', href: '/admin/requests', icon: Inbox, countKey: 'newRequests' },
      { label: 'MOUs & Agreements', href: '/admin/agreements', icon: FileSignature, countKey: 'pendingSignatures' },
      { label: 'Document Vault', href: '/admin/documents', icon: FolderLock },
      { label: 'Compliance Tracking', href: '/admin/compliance', icon: ShieldAlert },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Clients Directory', href: '/admin/clients', icon: Users },
      { label: 'Legal Team & Staff', href: '/admin/team', icon: Briefcase },
      { label: 'Activity Audit Log', href: '/admin/activity', icon: ScrollText },
    ],
  },
];

export default function AdminSidebar({ user, counts }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const getCount = (key?: string) => {
    if (!key || !counts) return 0;
    return (counts as any)[key] || 0;
  };

  // Generate initials avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')
    : 'AU';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-neutral-950 text-white">

      {/* Brand Header */}
      <div className="h-[64px] flex items-center justify-between px-5 border-b border-neutral-800/80">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs">
            <Scale className="w-4 h-4 text-neutral-950" />
          </div>
          <div>
            <span className="font-black tracking-tight text-white text-sm block leading-tight">
              LEGALITY
            </span>
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest block">
              {user?.role === 'ADMIN' ? 'Admin Console' : 'Counsel Console'}
            </span>
          </div>
        </Link>

        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Live Status Bar */}
      <div className="px-5 py-3 border-b border-neutral-800/60 bg-neutral-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Platform Live</span>
          </div>
          <div className="flex items-center gap-3">
            {(counts?.newRequests ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-blue-400">{counts!.newRequests}</span>
                <span className="text-[9px] text-neutral-500">new</span>
              </div>
            )}
            {(counts?.pendingSignatures ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-amber-400">{counts!.pendingSignatures}</span>
                <span className="text-[9px] text-neutral-500">sign</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-600 px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);
                const count = getCount((item as any).countKey);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-neutral-950 shadow-[0_2px_8px_rgba(255,255,255,0.08)]'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-200'}`} />
                    <span className="flex-1 font-semibold">{item.label}</span>
                    {count > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md tabular-nums ${
                        isActive
                          ? 'bg-neutral-200 text-neutral-900'
                          : (item as any).countKey === 'newRequests'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {count}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3 h-3 text-neutral-500 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-3 border-t border-neutral-800/80">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-neutral-900/70 mb-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-700 flex items-center justify-center text-white font-bold text-xs shrink-0 tracking-wide">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{user?.fullName || 'Legal Staff'}</div>
            <div className="text-[10px] text-neutral-500 truncate font-mono">
              {user?.employeeProfile?.designation || user?.role}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 rounded-xl transition-all group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>Sign Out of Console</span>
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
          className="p-2 bg-neutral-950 border border-neutral-800 rounded-xl shadow-lg text-neutral-400 hover:text-white transition"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
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
