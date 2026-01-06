"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Logo } from "@/app/components/icons";
import { useTheme } from "@/app/contexts/ThemeContext";
import { getMainAppUrl } from "@/lib/api-client";
import { ChevronDown, User } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const resourcesMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close resources menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourcesMenuRef.current && !resourcesMenuRef.current.contains(event.target as Node)) {
        setResourcesMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors">
      <nav className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto dark:[&_path:first-child]:fill-white dark:[&_path:last-child]:fill-slate-900 dark:[&_text]:fill-white" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 font-medium transition-colors"
            >
              Home
            </Link>

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesMenuRef}>
              <button
                onClick={() => setResourcesMenuOpen(!resourcesMenuOpen)}
                className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 font-medium transition-colors"
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform ${resourcesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <Link
                    href="/blog"
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => setResourcesMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <a
                    href={getMainAppUrl('/laws')}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Landlord Laws
                  </a>
                  <a
                    href={getMainAppUrl('/templates')}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Forms & Templates
                  </a>
                  <Link
                    href="/calculators"
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => setResourcesMenuOpen(false)}
                  >
                    Calculators
                  </Link>
                  <Link
                    href="/faq"
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => setResourcesMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Owner Login */}
            <a
              href={getMainAppUrl('/owner/login')}
              className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              Owner Login
            </a>

            {/* Property Manager Login */}
            <a
              href={getMainAppUrl('/pm/login')}
              className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              PM Login
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                // Moon icon for dark mode
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                // Sun icon for light mode
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            <Link
              href="/get-started"
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle Button (Mobile) */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                // Moon icon for dark mode
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                // Sun icon for light mode
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded-lg p-2 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                // Close icon (X)
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Resources - Mobile */}
              <div className="space-y-2">
                <div className="text-slate-900 dark:text-white font-semibold text-sm">Resources</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/blog"
                    className="block text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <a
                    href={getMainAppUrl('/laws')}
                    className="block text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                  >
                    Landlord Laws
                  </a>
                  <a
                    href={getMainAppUrl('/templates')}
                    className="block text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                  >
                    Forms & Templates
                  </a>
                  <Link
                    href="/calculators"
                    className="block text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Calculators
                  </Link>
                  <Link
                    href="/faq"
                    className="block text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                </div>
              </div>

              <Link
                href="/about"
                className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
                <a
                  href={getMainAppUrl('/owner/login')}
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  Owner Login
                </a>

                <a
                  href={getMainAppUrl('/pm/login')}
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  PM Login
                </a>

                <Link
                  href="/get-started"
                  className="block bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
