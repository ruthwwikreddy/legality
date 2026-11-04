'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Scale, ArrowRight, User, LogOut, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded bg-neutral-900 flex items-center justify-center text-white transition-colors group-hover:bg-neutral-800">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-neutral-950 text-base leading-none">
              LEGALITY
            </span>
            <span className="text-[10px] text-neutral-500 font-medium tracking-wider uppercase mt-0.5">
              Legal Services & Documentation
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
          <Link href="/services" className="hover:text-neutral-950 transition-colors">
            Our Services
          </Link>
          <Link href="/how-it-works" className="hover:text-neutral-950 transition-colors">
            How It Works
          </Link>
          <Link href="/about" className="hover:text-neutral-950 transition-colors">
            About LEGALITY
          </Link>
          <Link href="/contact" className="hover:text-neutral-950 transition-colors">
            Contact
          </Link>
        </nav>

        {/* User CTA */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                href={currentUser.role === 'CLIENT' ? '/portal' : '/admin'}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>{currentUser.fullName.split(' ')[0]} ({currentUser.role})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-neutral-500 hover:text-neutral-800 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold px-3.5 py-2 text-neutral-700 hover:text-neutral-950 transition"
              >
                Client Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition shadow-sm"
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
          className="md:hidden p-2 text-neutral-700"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 hover:text-neutral-950 py-1"
          >
            Our Services
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 hover:text-neutral-950 py-1"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 hover:text-neutral-950 py-1"
          >
            About LEGALITY
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 hover:text-neutral-950 py-1"
          >
            Contact
          </Link>
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            {currentUser ? (
              <Link
                href={currentUser.role === 'CLIENT' ? '/portal' : '/admin'}
                className="w-full text-center py-2 rounded text-xs font-semibold bg-neutral-900 text-white"
              >
                Go to {currentUser.role === 'CLIENT' ? 'Client Portal' : 'Admin Dashboard'}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full text-center py-2 rounded text-xs font-semibold border border-neutral-300 text-neutral-800"
                >
                  Client Login
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2 rounded text-xs font-semibold bg-neutral-900 text-white"
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

