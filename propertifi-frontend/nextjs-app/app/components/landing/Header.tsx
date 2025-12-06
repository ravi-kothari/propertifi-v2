'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

const PropertifiLogo: React.FC = () => (
  <div className="flex items-center space-x-2">
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" fill="#3B82F6"/>
      <path d="M16 10L2 17L16 24L30 17L16 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 9L16 16V30" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 9L16 16" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </motion.svg>
    <span className="font-extrabold text-2xl text-propertifi-gray-900">PROPERTIFI</span>
  </div>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/home' },
    { name: 'How It Works', href: '/home#how-it-works' },
    { name: 'Property Types', href: '/home#property-types' },
    { name: 'FAQ', href: '/home#faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/home#contact' },
  ];

  return (
    <motion.header
      className={`bg-white/90 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md py-2' : 'shadow-sm py-0'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/home" aria-label="Home">
              <PropertifiLogo />
            </Link>
          </motion.div>

          <nav className="hidden lg:flex lg:space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="text-sm font-semibold text-propertifi-gray-700 hover:text-propertifi-blue-dark transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-propertifi-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            {/* Owner Login */}
            <Link href="/login?type=owner">
              <motion.div
                className="text-sm font-semibold text-propertifi-gray-700 hover:text-propertifi-blue-dark transition-colors flex items-center group cursor-pointer px-3 py-2 rounded-lg hover:bg-propertifi-blue-light/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Owner Login
              </motion.div>
            </Link>

            {/* Property Manager Login */}
            <Link href="/login?type=manager">
              <motion.div
                className="text-sm font-semibold text-propertifi-gray-700 hover:text-propertifi-orange-dark transition-colors flex items-center group cursor-pointer px-3 py-2 rounded-lg hover:bg-propertifi-orange-light/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Manager Login
              </motion.div>
            </Link>

            <motion.a
              href="/get-started"
              className="bg-propertifi-orange hover:bg-propertifi-orange-dark text-white font-bold py-2 px-5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>

            <motion.span
              className="text-sm font-bold text-propertifi-gray-900 flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-propertifi-orange" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              916-250-1264
            </motion.span>
          </div>

          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden bg-white shadow-lg absolute top-20 left-0 w-full border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-4 p-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-base font-semibold text-propertifi-gray-700 hover:text-propertifi-blue-dark transition-colors py-2 px-4 rounded-lg hover:bg-propertifi-blue-light block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="border-t border-gray-200 pt-4 flex flex-col space-y-4">
                {/* Owner Login */}
                <Link href="/login?type=owner">
                  <motion.div
                    className="text-base font-semibold text-propertifi-gray-700 hover:text-propertifi-blue-dark transition-colors flex items-center py-2 px-4 rounded-lg hover:bg-propertifi-blue-light cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Owner Login
                  </motion.div>
                </Link>

                {/* Property Manager Login */}
                <Link href="/login?type=manager">
                  <motion.div
                    className="text-base font-semibold text-propertifi-gray-700 hover:text-propertifi-orange-dark transition-colors flex items-center py-2 px-4 rounded-lg hover:bg-propertifi-orange-light/20 cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 0.5) * 0.05 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Manager Login
                  </motion.div>
                </Link>

                <motion.a
                  href="/get-started"
                  className="bg-propertifi-orange hover:bg-propertifi-orange-dark text-white text-center font-bold py-3 px-5 rounded-full transition-colors shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.05 }}
                >
                  Get Started
                </motion.a>

                <motion.span
                  className="text-base font-bold text-propertifi-gray-900 text-center flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (navLinks.length + 2) * 0.05 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-propertifi-orange" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  916-250-1264
                </motion.span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
