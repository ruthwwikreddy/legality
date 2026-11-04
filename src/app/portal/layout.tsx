import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClientSidebar from '@/components/ClientSidebar';
import DemoSwitcher from '@/components/DemoSwitcher';
import Link from 'next/link';
import { Bell, User } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Get unread notification count
  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  });

  return (
    <div className="min-h-screen flex bg-[#fbfbfc] text-neutral-900">
      <ClientSidebar user={user} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-neutral-200 pl-14 pr-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Client Portal
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-semibold text-neutral-800">
              {user.clientProfile?.organizationName || user.fullName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/portal/notifications"
              className="relative p-2 text-neutral-500 hover:text-neutral-800 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full" />
              )}
            </Link>

            <Link
              href="/portal/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 transition text-xs font-medium text-neutral-800"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>{user.fullName}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <DemoSwitcher />
    </div>
  );
}

