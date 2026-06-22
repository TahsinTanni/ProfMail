import React from 'react';
import { Link, NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
            <NavLink 
              to="/drafts" 
              className={({ isActive }) => 
                `transition-colors duration-200 ${isActive ? 'text-brand-yellow' : 'text-neutral-400 hover:text-white'}`
              }
            >
              Drafts
            </NavLink>
            <NavLink 
              to="/templates" 
              className={({ isActive }) => 
                `transition-colors duration-200 ${isActive ? 'text-brand-yellow' : 'text-neutral-400 hover:text-white'}`
              }
            >
              Templates
            </NavLink>
            <NavLink 
              to="/history" 
              className={({ isActive }) => 
                `transition-colors duration-200 ${isActive ? 'text-brand-yellow' : 'text-neutral-400 hover:text-white'}`
              }
            >
              History
            </NavLink>
          </nav>

        </div>
      </header>

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
