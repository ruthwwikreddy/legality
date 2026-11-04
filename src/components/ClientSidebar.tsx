'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col shrink-0 min-h-screen">
      {/* Platform Branding */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-neutral-200">
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
      <nav className="flex-1 p-3 space-y-1">
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
    </aside>
  );
}

