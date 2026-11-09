'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Scale, ArrowRight, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'Our Services', href: '/services' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About LEGALITY', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shadow-xs group-hover:bg-neutral-800 transition-colors">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-neutral-950 text-sm leading-none">
              LEGALITY
            </span>
            <span className="text-[9px] text-neutral-500 font-semibold tracking-wider uppercase mt-0.5">
              Legal Tech & Operations
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-neutral-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-neutral-950 font-semibold bg-neutral-100'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User CTA */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <Link
                href={currentUser.role === 'CLIENT' ? '/portal' : '/admin'}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 transition border border-neutral-200/60"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>{currentUser.fullName.split(' ')[0]}</span>
                <span className="text-[10px] text-neutral-500 font-mono">({currentUser.role})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-neutral-400 hover:text-rose-600 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-1.5 text-neutral-700 hover:text-neutral-950 transition rounded-lg hover:bg-neutral-50"
              >
                Client Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition shadow-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-700 hover:text-neutral-950"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-xs font-medium py-2 px-3 rounded-lg ${
                  isActive
                    ? 'text-neutral-950 font-bold bg-neutral-100'
                    : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            {currentUser ? (
              <Link
                href={currentUser.role === 'CLIENT' ? '/portal' : '/admin'}
                className="w-full text-center py-2.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white"
              >
                Go to {currentUser.role === 'CLIENT' ? 'Client Portal' : 'Admin Console'}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full text-center py-2 rounded-lg text-xs font-semibold border border-neutral-300 text-neutral-800"
                >
                  Client Login
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
