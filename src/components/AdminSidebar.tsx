'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <aside className="w-64 bg-neutral-950 text-neutral-300 flex flex-col shrink-0 min-h-screen border-r border-neutral-800">
      {/* Branding */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-neutral-800">
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
      <nav className="flex-1 p-3 space-y-1">
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
    </aside>
  );
}

