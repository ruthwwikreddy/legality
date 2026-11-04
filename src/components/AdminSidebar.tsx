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
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'All Requests', href: '/admin/requests', icon: Inbox },
    { label: 'MOU & Agreements', href: '/admin/agreements', icon: FileSignature },
    { label: 'Document Repository', href: '/admin/documents', icon: FolderLock },
    { label: 'Clients Directory', href: '/admin/clients', icon: Users },
    { label: 'Legal Team & Staff', href: '/admin/team', icon: Briefcase },
    { label: 'Compliance Tracking', href: '/admin/compliance', icon: ShieldAlert },
    { label: 'Activity Audit Log', href: '/admin/activity', icon: ScrollText },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-300 border-r border-neutral-800">
      {/* Branding */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-white text-neutral-950 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-white text-sm leading-tight">
              LEGALITY
            </span>
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
              {user?.role === 'ADMIN' ? 'Managing Console' : 'Counsel Console'}
            </span>
          </div>
        </div>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Staff summary */}
      <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40">
        <div className="text-xs font-semibold text-white truncate">
          {user?.fullName || 'Legal Staff'}
        </div>
        <div className="text-[11px] text-neutral-400 truncate mt-0.5">
          {user?.employeeProfile?.designation || user?.role} · {user?.employeeProfile?.department || 'Staff'}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top trigger button */}
      <div className="md:hidden fixed top-3 left-4 z-30">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-sm text-neutral-300 hover:text-white"
          aria-label="Open administrative navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 min-h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
