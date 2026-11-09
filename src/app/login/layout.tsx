import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client & Counsel Sign In',
  description:
    'Secure portal login for LEGALITY enterprise clients, legal counsel, and platform administrators.',
  robots: {
    index: true,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

