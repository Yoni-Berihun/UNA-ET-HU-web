'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false); // For Desktop Teams Dropdown
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false); // For Desktop Newsletter Dropdown
  const [isMobileTeamsOpen, setIsMobileTeamsOpen] = useState(false); // For Mobile Teams Submenu
  const [isMobileNewsletterOpen, setIsMobileNewsletterOpen] = useState(false); // For Mobile Newsletter Submenu
  const dropdownRef = useRef<HTMLDivElement>(null);
  const teamsDropdownRef = useRef<HTMLDivElement>(null);
  const newsletterDropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (teamsDropdownRef.current && !teamsDropdownRef.current.contains(event.target as Node)) {
        setIsTeamsOpen(false);
      }
      if (newsletterDropdownRef.current && !newsletterDropdownRef.current.contains(event.target as Node)) {
        setIsNewsletterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const loadingToast = toast.loading('Signing out...');
    try {
      await signOut({ redirect: false });
      toast.success('Signed out successfully', { id: loadingToast });
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to sign out', { id: loadingToast });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const canGoBack = pathname !== '/' && !pathname.startsWith('/admin');

  const teamLinks = [
    { name: 'Our Teams Overview', href: '/teams', icon: 'groups' },
    { name: 'MUN', href: '/mun', icon: 'public' },
    { name: 'SDGs', href: '/sdg', icon: 'eco' }, // New SDG Page
    { name: 'Innovation', href: '/innovation', icon: 'lightbulb' }, // Placeholder
    { name: 'Project Team', href: '/projects', icon: 'engineering' }, // Placeholder
    { name: 'Debate Team', href: '/debate', icon: 'record_voice_over' }, // Placeholder
  ];

  return (
    <>
      {/* Floating Back Button */}
      {canGoBack && (
        <button
          onClick={() => router.back()}
          className="fixed top-[60px] left-4 z-[5001] bg-white/90 dark:bg-[#1a1d23]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-2 shadow-lg transition-all hover:scale-105 active:scale-95 group"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
        </button>
      )}

      <header className="sticky top-0 z-[5000] isolate w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#212935]/80 backdrop-blur-md overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">

              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                  <Image
                    src="/UN_blue_logo.svg"
                    alt="UNA-ET-HU Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                  UNA-ET-HU
                </h1>
              </Link>



              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                <Link href="/" className="px-4 py-2 rounded-full text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Home
                </Link>

                {/* Teams Dropdown */}
                <div ref={teamsDropdownRef} className="relative">
                  <button
                    onClick={() => setIsTeamsOpen(!isTeamsOpen)}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Teams
                    <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isTeamsOpen ? 'rotate-180' : ''}`}>
                      keyboard_arrow_down
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 z-[5050] mt-2 w-60 bg-white dark:bg-[#1a1d23] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-200 origin-top ${isTeamsOpen
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                      }`}
                  >
                    <div className="p-2 flex flex-col gap-1">
                      <Link
                        href="/mun"
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsTeamsOpen(false)}
                      >
                        <span>Model UN Team</span>
                      </Link>
                      <Link
                        href="/sdg"
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsTeamsOpen(false)}
                      >
                        <span>SDG Ambassadors</span>
                      </Link>
                      <Link
                        href="/teams?active=innovation"
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsTeamsOpen(false)}
                      >
                        <span>Innovation Team</span>
                      </Link>
                      <Link
                        href="/teams?active=debate"
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsTeamsOpen(false)}
                      >
                        <span>Debate Team</span>
                      </Link>
                      <Link
                        href="/teams?active=project"
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsTeamsOpen(false)}
                      >
                        <span>Project Team</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <Link href="/gallery" className="px-4 py-2 rounded-full text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Gallery
                </Link>


                {/* Newsletter Dropdown */}
                <div ref={newsletterDropdownRef} className="relative">
                  <button
                    onClick={() => setIsNewsletterOpen(!isNewsletterOpen)}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    NewsLetter
                    <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isNewsletterOpen ? 'rotate-180' : ''}`}>
                      keyboard_arrow_down
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 z-[5050] mt-2 w-48 bg-white dark:bg-[#1a1d23] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-200 origin-top ${isNewsletterOpen
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                      }`}
                  >
                    <div className="p-2 flex flex-col gap-1">
                      <Link
                        href="/magazine"
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsNewsletterOpen(false)}
                      >
                        <span>Magazine</span>
                      </Link>
                      <Link
                        href="/blog"
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsNewsletterOpen(false)}
                      >
                        <span>Blog</span>
                      </Link>
                    </div>
                  </div>
                </div>
                <Link href="/about" className="px-4 py-2 rounded-full text-sm font-medium text-[#5e5f8d] dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  About Us
                </Link>
                {(session as any)?.user?.role === 'SUPER_ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                    Super Admin
                  </Link>
                )}

              </div>
            </div>


            {/* Right side: desktop account / auth + mobile menu button */}
            <div className="flex items-center gap-2">
              {status === 'loading' ? (
                <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              ) : session ? (
                // Show user avatar and dropdown when logged in
                <div className="relative z-[5100] hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <span className="hidden sm:block text-sm font-semibold text-slate-900 dark:text-white">
                      {session.user?.name}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                      {(session.user as any)?.image ? (
                        <img
                          src={(session.user as any).image}
                          alt={session.user?.name || 'User'}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(session.user?.name || 'User')
                      )}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 z-[5100] w-64 bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {session.user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        {(session.user as any)?.role === 'SUPER_ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-semibold"
                          >
                            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                            Super Admin Dashboard
                          </Link>
                        )}
                        {(session.user as any)?.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">dashboard</span>
                            Admin Dashboard
                          </Link>
                        )}

                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">person</span>
                          My Profile
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">settings</span>
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-700 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Show Login and Join Us buttons when not logged in
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    href="/auth/signin"
                    className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary px-4 py-2 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-6 py-2 rounded-lg transition-all shadow-md shadow-primary/20"
                  >
                    Join Us
                  </Link>
                </div>
              )}

              {/* Mobile hamburger button */}
              <button
                className="inline-flex items-center justify-center rounded-full p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <span className="material-symbols-outlined text-[24px]">
                  menu
                </span>
              </button>
            </div>
          </div>
        </div>
      </header >

      {/* Mobile Drawer & Backdrop (kept outside header to avoid stacking/overflow issues) */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9990] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 z-[9999] h-[100dvh] w-[280px] bg-white dark:bg-[#1a1d23] shadow-2xl transition-[right] duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'right-0' : '-right-[280px]'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 pl-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="relative w-16 h-16">
                <Image src="/UN_blue_logo.svg" alt="Logo" fill className="object-contain" />
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 min-h-0 overflow-y-auto py-4 px-4 space-y-2 bg-white dark:bg-[#1a1d23]">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 rounded-full hover:bg-primary/10 hover:text-primary transition-all group"
            >
              <span className="material-symbols-outlined text-[24px] text-slate-500 group-hover:text-primary transition-colors">home</span>
              Home
            </Link>

            {/* Mobile Teams Dropdown (Collapsible) */}
            <div className="rounded-2xl overflow-hidden">
              <button
                onClick={() => setIsMobileTeamsOpen(!isMobileTeamsOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 rounded-full hover:bg-primary/10 hover:text-primary transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[24px] text-slate-500 group-hover:text-primary transition-colors">groups</span>
                  Teams
                </div>
                <span className={`material-symbols-outlined text-lg transition-transform duration-200 ${isMobileTeamsOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileTeamsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="pl-4 space-y-1 ml-4 border-l-2 border-slate-100 dark:border-slate-800 my-1">
                  {teamLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:text-primary dark:hover:text-white transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-primary"></span>
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Newsletter Dropdown (Collapsible) */}
            <div className="rounded-2xl overflow-hidden">
              <button
                onClick={() => setIsMobileNewsletterOpen(!isMobileNewsletterOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 rounded-full hover:bg-primary/10 hover:text-primary transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[24px] text-slate-500 group-hover:text-primary transition-colors">article</span>
                  NewsLetter
                </div>
                <span className={`material-symbols-outlined text-lg transition-transform duration-200 ${isMobileNewsletterOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileNewsletterOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="pl-4 space-y-1 ml-4 border-l-2 border-slate-100 dark:border-slate-800 my-1">
                  <Link
                    href="/magazine"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:text-primary dark:hover:text-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-primary"></span>
                    <span>Magazine</span>
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:text-primary dark:hover:text-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-primary"></span>
                    <span>Blog</span>
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/gallery"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 rounded-full hover:bg-primary/10 hover:text-primary transition-all group"
            >
              <span className="material-symbols-outlined text-[24px] text-slate-500 group-hover:text-primary transition-colors">perm_media</span>
              Gallery
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 rounded-full hover:bg-primary/10 hover:text-primary transition-all group"
            >
              <span className="material-symbols-outlined text-[24px] text-slate-500 group-hover:text-primary transition-colors">info</span>
              About Us
            </Link>

            {session ? (
              <>
                <div className="my-2 border-t border-slate-100 dark:border-slate-800 mx-4"></div>

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 rounded-full hover:bg-primary/10 hover:text-primary transition-all group"
                >
                  <span className="material-symbols-outlined text-[24px] text-slate-500 group-hover:text-primary transition-colors">person</span>
                  My Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 rounded-full hover:bg-primary/10 hover:text-primary transition-all group"
                >
                  <span className="material-symbols-outlined text-[24px] text-slate-500 group-hover:text-primary transition-colors">settings</span>
                  Settings
                </Link>
              </>
            ) : null}

            <div className="my-2 border-t border-slate-100 dark:border-slate-800 mx-4"></div>

            {/* Admin Links */}
            {(session as any)?.user?.role === 'SUPER_ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
                Super Admin
              </Link>
            )}
            {(session as any)?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-primary rounded-full hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">dashboard</span>
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Drawer Footer (Auth) */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1d23]">
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-black/20 border border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {(session.user as any)?.image ? (
                      <img
                        src={(session.user as any).image}
                        alt={session.user?.name || 'User'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(session.user?.name || 'User')
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {session.user?.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 bg-white dark:bg-black/20 border border-red-100 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

