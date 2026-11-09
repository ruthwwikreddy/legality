import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClientSidebar from '@/components/ClientSidebar';
import Link from 'next/link';
import { Bell, PlusCircle } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect('/login');

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  });

  const orgName = (user as any).clientProfile?.organizationName;

  return (
    <div className="min-h-screen flex bg-[#f8f8f9] text-neutral-900">
      <ClientSidebar user={user} unreadCount={unreadCount} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Refined Top Header */}
        <header className="h-[64px] bg-white border-b border-neutral-200/80 pl-16 pr-5 md:pl-6 md:pr-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-xs min-w-0">
            <span className="font-bold text-neutral-400 uppercase tracking-widest hidden sm:block shrink-0">
              Client Portal
            </span>
            <span className="text-neutral-300 hidden sm:block">/</span>
            <span className="font-bold text-neutral-900 truncate">
              {orgName || user.fullName}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* New Request CTA */}
            <Link
              href="/portal/requests/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 text-white text-[11px] font-bold hover:bg-neutral-800 transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Request</span>
            </Link>

            {/* Notification Bell */}
            <Link
              href="/portal/notifications"
              className="relative p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-black flex items-center justify-center tabular-nums">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User Avatar */}
            <Link
              href="/portal/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 hover:border-neutral-300 transition"
            >
              <div className="w-5 h-5 rounded-md bg-neutral-950 text-white flex items-center justify-center text-[9px] font-black">
                {user.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
              </div>
              <span className="text-xs font-semibold text-neutral-900 hidden sm:block">
                {user.fullName.split(' ')[0]}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
