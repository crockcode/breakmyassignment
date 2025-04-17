'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#12151c]/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                BreakMyAssignment
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                href="/" 
                className={`text-gray-300 hover:text-white transition-colors ${
                  pathname === '/' ? 'font-semibold text-white' : ''
                }`}
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className={`text-gray-300 hover:text-white transition-colors ${
                  pathname === '/dashboard' ? 'font-semibold text-white' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/about" 
                className={`text-gray-300 hover:text-white transition-colors ${
                  pathname === '/about' ? 'font-semibold text-white' : ''
                }`}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`text-gray-300 hover:text-white transition-colors ${
                  pathname === '/contact' ? 'font-semibold text-white' : ''
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#12151c]/95 backdrop-blur-md">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors ${
              pathname === '/' ? 'bg-gray-800 text-white' : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors ${
              pathname === '/dashboard' ? 'bg-gray-800 text-white' : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors ${
              pathname === '/about' ? 'bg-gray-800 text-white' : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors ${
              pathname === '/contact' ? 'bg-gray-800 text-white' : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
} 