import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Legal Advisory Desk',
  description:
    'Connect with LEGALITY legal counsel for contract drafting, statutory permissions, regulatory compliance, and corporate legal operations.',
  openGraph: {
    title: 'Contact LEGALITY Legal Advisory Desk',
    description: 'Direct inquiries to experienced legal counsel and compliance specialists in India.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
