'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, MouseEvent, KeyboardEvent } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileBtnRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on escape, click outside
  useEffect(() => {
    function handleClick(e: MouseEvent | globalThis.MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent | globalThis.KeyboardEvent) {
      if (e.key === 'Escape') setProfileOpen(false);
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [profileOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    setMobileOpen(false);
    router.refresh();
  };

  // Get user initials for avatar
  const getInitials = (email: string | null | undefined): string =>
    email && email.length > 0 ? email[0].toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/90 backdrop-blur">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 grid place-content-center ring-2 ring-purple-200 group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold text-black dark:text-white tracking-tight">
            SkillSense
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink href="/#how-it-works">How It Works</NavLink>
          {/* Only show dashboard/profile if logged in */}
          {user && <NavLink href="/dashboard">Dashboard</NavLink>}

          {!user ? (
            <Link
              href="/auth"
              className="px-5 py-2 ml-4 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                ref={profileBtnRef}
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition group"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-controls="profile-menu"
                type="button"
              >
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 grid place-content-center text-white font-bold text-sm shadow-inner">
                  {getInitials(user.email)}
                </span>
                <span className="text-sm text-gray-700 dark:text-white font-medium">
                  {user.email?.split('@')[0] ?? ''}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 h-4 ml-1 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {profileOpen && (
                <div
                  ref={profileMenuRef}
                  id="profile-menu"
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg py-2 z-50 animate-fade-in"
                  tabIndex={-1}
                  role="menu"
                  aria-label="User menu"
                >
                  <Link
                    href="/profile"
                    className="block px-5 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition"
                    onClick={() => setProfileOpen(false)}
                    role="menuitem"
                  >
                    <User className="inline-block mr-2 w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition"
                    role="menuitem"
                    type="button"
                  >
                    <LogOut className="inline-block mr-2 w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((v) => !v)}
          type="button"
        >
          {mobileOpen ? (
            <X className="w-7 h-7 text-black dark:text-white" />
          ) : (
            <Menu className="w-7 h-7 text-black dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 px-3 pb-4 pt-1 space-y-2 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 rounded-b-xl shadow animate-slide-down">
          <NavLink href="/#how-it-works" onClick={() => setMobileOpen(false)}>
            How It Works
          </NavLink>
          {user && (
            <NavLink href="/dashboard" onClick={() => setMobileOpen(false)}>
              Dashboard
            </NavLink>
          )}
          {!user ? (
            <Link
              href="/auth"
              className="block text-base font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/profile"
                className="block text-base font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block text-base font-medium text-red-600 py-2 w-full text-left"
                type="button"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

// Utility: NavLink for unified link style, with optional onClick
function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-700 dark:text-gray-300 font-medium hover:underline transition"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
