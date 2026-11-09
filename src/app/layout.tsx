import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://legality.in'),
  title: {
    default: 'LEGALITY — Digital Legal Services & Documentation Management Platform',
    template: '%s | LEGALITY',
  },
  description:
    'LEGALITY is an enterprise digital legal services management platform. Drafting & reviewing MOUs & Agreements, Commercial Legal Documentation, Statutory Permissions & Approvals, and Regulatory Compliance & Enforcement with Section 10A IT Act compliant digital signatures.',
  keywords: [
    'Legal Services Platform',
    'MOU Drafting',
    'Contract Review',
    'Digital Signing India',
    'Section 10A IT Act eSign',
    'Statutory Permissions',
    'ROC Compliance',
    'MCA Filings',
    'Legal Operations Software',
    'Corporate Counsel Portal',
  ],
  authors: [{ name: 'LEGALITY Legal Technologies' }],
  creator: 'LEGALITY',
  publisher: 'LEGALITY',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'LEGALITY — Digital Legal Services & Documentation Management Platform',
    description:
      'Digitise the complete client-to-legal-team workflow. Draft MOUs, review contracts, execute with multi-party digital signatures, and manage corporate compliance seamlessly.',
    url: 'https://legality.in',
    siteName: 'LEGALITY',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LEGALITY — Digital Legal Services Management',
    description:
      'Enterprise platform for MOUs, legal documentation, permissions & regulatory compliance management.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://legality.in',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'LEGALITY',
  description:
    'Digital legal services and documentation management platform providing drafting of MOUs & agreements, legal documentation vetting, statutory licensing, and corporate compliance.',
  url: 'https://legality.in',
  telephone: '+91-11-40982300',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Barakhamba Road, Connaught Place',
    addressLocality: 'New Delhi',
    addressRegion: 'Delhi',
    postalCode: '110001',
    addressCountry: 'IN',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  serviceType: [
    'MOUs & Agreements Drafting',
    'Commercial Contract Review',
    'Statutory Permissions & Licences',
    'Corporate Regulatory Compliance',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}
      >
        {children}
      </body>
    </html>
  );
}
