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
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'Overview', href: '/portal', icon: LayoutDashboard },
    { label: 'My Requests', href: '/portal/requests', icon: FileText },
    { label: 'New Request', href: '/portal/requests/new', icon: PlusCircle },
    { label: 'My Documents', href: '/portal/documents', icon: Files },
    { label: 'Agreements & Signing', href: '/portal/agreements', icon: FileSignature },
    { label: 'Permissions & Licences', href: '/portal/permissions', icon: ShieldAlert },
    { label: 'Compliance Records', href: '/portal/compliance', icon: ClipboardCheck },
    { label: 'Notifications', href: '/portal/notifications', icon: Bell },
    { label: 'Company Profile', href: '/portal/profile', icon: Building },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-neutral-900 border-r border-neutral-200">
      {/* Platform Branding */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center text-white">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-neutral-900 text-sm leading-tight">
              LEGALITY
            </span>
            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
              Client Portal
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Client summary pill */}
      <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
        <div className="text-xs font-semibold text-neutral-900 truncate">
          {user?.fullName || 'Client Account'}
        </div>
        <div className="text-[11px] text-neutral-500 truncate mt-0.5">
          {user?.clientProfile?.organizationName || user?.email}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/portal'
              ? pathname === '/portal'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Sign out */}
      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
          className="p-2 bg-white border border-neutral-200 rounded-lg shadow-sm text-neutral-700 hover:text-neutral-950"
          aria-label="Open portal navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
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
