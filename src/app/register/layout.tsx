import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Registration & Onboarding',
  description:
    'Register your enterprise or corporate organization on LEGALITY to initiate legal service requests, upload contracts, and execute digital agreements.',
  openGraph: {
    title: 'Register for LEGALITY Legal Services Platform',
    description: 'Onboard your business for digital legal drafting, vetting, permissions, and compliance management.',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
