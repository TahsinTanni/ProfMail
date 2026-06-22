import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? 'hidden' : '';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileNavOpen]);

  const navLinks = [
    { to: '/drafts', label: 'Drafts' },
    { to: '/templates', label: 'Templates' },
    { to: '/history', label: 'History' },
  ];

  return (
    <div className="min-height-screen bg-brand-dark text-white flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-[#2a2a2a] bg-brand-dark/75 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-[20px] font-bold tracking-tight text-[#e8d44d] hover:opacity-85 transition-opacity">
            ProfMail
          </Link>


          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors duration-200 ${isActive ? 'text-brand-yellow' : 'text-neutral-400 hover:text-white'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-brand-card text-neutral-200 transition-colors hover:border-[#3a3a3a] hover:text-white"
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileNavOpen((isOpen) => !isOpen)}
          >
            {isMobileNavOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
        onClick={() => setIsMobileNavOpen(false)}
      />

      <aside
        id="mobile-navigation"
        className={`fixed right-0 top-0 z-50 h-dvh w-[82vw] max-w-xs border-l border-brand-border bg-brand-dark shadow-2xl shadow-black/60 transition-transform duration-300 ease-out md:hidden ${
          isMobileNavOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMobileNavOpen}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#2a2a2a] px-5">
          <Link
            to="/"
            className="text-[20px] font-bold tracking-tight text-brand-yellow transition-opacity hover:opacity-85"
            onClick={() => setIsMobileNavOpen(false)}
          >
            ProfMail
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-brand-card text-neutral-200 transition-colors hover:border-[#3a3a3a] hover:text-white"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-4 py-5 text-sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileNavOpen(false)}
              className={({ isActive }) =>
                `rounded-lg border px-4 py-3 transition-colors duration-200 ${
                  isActive
                    ? 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow'
                    : 'border-transparent text-neutral-300 hover:border-brand-border hover:bg-brand-card hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-brand-dark py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; 2026 Tahsin Tanni. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-neutral-300 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
