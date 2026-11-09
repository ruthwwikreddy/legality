import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { Shield } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role === 'CLIENT') redirect('/portal');

  // Live counts for sidebar badges
  const [newRequests, pendingSignatures] = await Promise.all([
    prisma.serviceRequest.count({ where: { status: 'SUBMITTED' } }),
    prisma.agreement.count({
      where: { status: { in: ['AWAITING_SIGNATURES', 'PARTIALLY_SIGNED'] } },
    }),
  ]);

  return (
    <div className="min-h-screen flex bg-[#f8f8f9] text-neutral-900">
      <AdminSidebar
        user={user}
        counts={{ newRequests, pendingSignatures }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Refined Top Header */}
        <header className="h-[64px] bg-white border-b border-neutral-200/80 pl-16 pr-5 md:pl-6 md:pr-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-neutral-400 uppercase tracking-widest hidden sm:block">
              {user.role === 'ADMIN' ? 'Platform Administration' : 'Counsel Operations'}
            </span>
            <span className="text-neutral-300 hidden sm:block">/</span>
            <span className="font-bold text-neutral-900">
              {user.employeeProfile?.designation || user.fullName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              <span>{user.role}</span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 hover:border-neutral-300 transition">
              <div className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center text-[9px] font-black tracking-wide">
                {user.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
              </div>
              <span className="text-xs font-semibold text-neutral-900 hidden sm:block">
                {user.fullName.split(' ')[0]}
              </span>
            </div>
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
