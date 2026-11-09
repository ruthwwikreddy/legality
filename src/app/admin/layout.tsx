import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { Shield, Bell, User } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Strict role-based protection
  if (user.role === 'CLIENT') {
    redirect('/portal');
  }

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  });

  return (
    <div className="min-h-screen flex bg-[#fbfbfc] text-neutral-900">
      <AdminSidebar user={user} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-neutral-200 pl-14 pr-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {user.role === 'ADMIN' ? 'Platform Administration' : 'Legal Counsel Console'}
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-semibold text-neutral-800">
              {user.employeeProfile?.designation || user.fullName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-mono font-medium">
              <Shield className="w-3.5 h-3.5 text-neutral-700" />
              <span>{user.role}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>{user.fullName}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

