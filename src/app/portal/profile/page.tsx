import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User, Building, Mail, Phone, FileBadge } from 'lucide-react';

export default async function ClientProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-950">
          Client & Enterprise Profile
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Registered corporate identity, tax identifiers, and statutory contact coordinates
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xl">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{user.fullName}</h2>
            <p className="text-xs text-neutral-500 font-mono">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
              Verified Client Entity
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
              Organization Name
            </span>
            <p className="font-semibold text-neutral-900 text-sm">
              {user.clientProfile?.organizationName || 'Not specified'}
            </p>
          </div>

          <div>
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
              Business Entity Type
            </span>
            <p className="font-semibold text-neutral-900 text-sm">
              {user.clientProfile?.businessType || 'Private Limited Company'}
            </p>
          </div>

          <div>
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
              GSTIN / PAN Tax Identifier
            </span>
            <p className="font-mono font-semibold text-neutral-900 text-sm">
              {user.clientProfile?.taxId || 'Not provided'}
            </p>
          </div>

          <div>
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
              Industry Domain
            </span>
            <p className="font-semibold text-neutral-900 text-sm">
              {user.clientProfile?.industry || 'Technology / Enterprise'}
            </p>
          </div>

          <div className="sm:col-span-2">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
              Registered Office Address
            </span>
            <p className="text-neutral-700 leading-relaxed">
              {user.clientProfile?.address || '4th Floor, Cyber Tech Park, Indiranagar, Bengaluru, Karnataka 560038'}
            </p>
          </div>

          {user.clientProfile?.notes && (
            <div className="sm:col-span-2 p-3 bg-neutral-50 rounded border border-neutral-100">
              <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">
                Account Notes & Scope
              </span>
              <p className="text-neutral-600">{user.clientProfile.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

