'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';

/* Utility: get initial letter from email */
const initial = (email?: string | null) =>
  email && email.length > 0 ? email[0].toUpperCase() : 'U';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileBtnRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  /* Track scroll for background/shadow effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close profile dropdown on outside click or Esc key */
  useEffect(() => {
    function handleClick(e: globalThis.MouseEvent) {
      if (
        profileOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target as Node)
      )
        setProfileOpen(false);
    }
    function handleEsc(e: globalThis.KeyboardEvent) {
      if (profileOpen && e.key === 'Escape') setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [profileOpen]);

  /* Logout handler */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    setMobileOpen(false);
    router.refresh();
  };

  /* NavLink with active underline and animations */
  function NavLink({
    href,
    children,
    onClick,
    active = false,
    className = '',
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    className?: string;
  }) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`
          relative px-4 py-2 font-medium transition-colors
          ${active ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}
          hover:text-blue-600 dark:hover:text-blue-400
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded
          before:absolute before:-bottom-1 before:left-0 before:h-[2px]
          before:bg-blue-600 before:rounded before:transition-all before:duration-300
          ${active ? 'before:w-full' : 'before:w-0'}
          ${className}
        `}
      >
        {children}
      </Link>
    );
  }

  return (
    <header
      className={`
      sticky top-0 z-50 w-full border-b border-white/10 dark:border-slate-800/60
      backdrop-blur-lg transition-shadow duration-300
      ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/95 shadow-lg'
          : 'bg-white/70 dark:bg-slate-900/80 shadow-sm'
      }
      px-4 py-3
    `}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="grid h-8 w-8 place-content-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow-inner group-hover:scale-105 transition-transform"></div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            SkillSense
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/how-it-works">How&nbsp;It&nbsp;Works</NavLink>

          {!user ? (
            <Link
              href="/auth"
              className="ml-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow hover:shadow-lg transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                ref={profileBtnRef}
                onClick={() => setProfileOpen((v) => !v)}
                className="group flex items-center gap-3 rounded-full px-3 py-1 hover:bg-white/30 dark:hover:bg-slate-800/60 transition"
                aria-expanded={profileOpen}
                type="button"
              >
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full object-cover shadow-inner"
                    unoptimized
                  />
                ) : (
                  <span className="grid h-8 w-8 place-content-center rounded-full bg-gradient-to-br from-blue-400 to-purple-600 text-white font-semibold text-sm shadow-inner">
                    {initial(user.email)}
                  </span>
                )}
                <span className="max-w-[120px] truncate text-slate-700 dark:text-slate-300 text-sm font-medium select-text">
                  {user.email?.split('@')[0]}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/20 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl"
                >
                  <Link
                    href={`/profile/${user.id}`}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-6 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-6 py-3 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden rounded-full p-3 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <nav className="md:hidden animate-slide-down rounded-b-xl border-t border-white/20 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg">
          <NavLink
            href="/#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block border-b border-white/10 dark:border-slate-700/40 px-6 py-4 text-lg"
          >
            How&nbsp;It&nbsp;Works
          </NavLink>

          {!user ? (
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="block rounded-b-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href={`/profile/${user.id}`}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-white/10 dark:border-slate-700/40 px-6 py-4 text-lg"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                type="button"
                className="block w-full rounded-b-xl bg-red-600 px-6 py-4 text-lg font-semibold text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
