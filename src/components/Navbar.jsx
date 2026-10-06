import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NAVBAR_DATA, PORTFOLIO_INFO } from '../data/portfolioData';

export default function Navbar({ onOpenResume }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const monogram = NAVBAR_DATA?.monogram || PORTFOLIO_INFO?.initials || 'RL';
  const links = NAVBAR_DATA?.links || [
    { id: 'work', label: 'Work', type: 'scroll', target: 'work' },
    { id: 'resume', label: 'Resume', type: 'action', action: 'openResume' }
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-scrolled-bg py-4' : 'bg-transparent py-7'
      }`}
      style={{
        backgroundColor: scrolled ? undefined : 'transparent',
        borderBottom: scrolled ? '1px solid var(--theme-border)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Square Monogram Badge */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer shadow-lg navbar-monogram"
          style={{
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-text)',
          }}
          aria-label="Home"
        >
          <span className="font-display font-bold text-sm tracking-tight">{monogram}</span>
        </motion.button>

        {/* Right: Nav Links dynamically loaded from config */}
        <nav className="flex items-center gap-8 md:gap-10">
          {links.map((link) => {
            if (link.type === 'action' && link.action === 'openResume') {
              return (
                <button
                  key={link.id || link.label}
                  onClick={onOpenResume}
                  className="hover-roll-trigger cursor-pointer text-sm md:text-base font-normal tracking-wide"
                  style={{ color: 'var(--theme-text)', opacity: 0.9 }}
                >
                  <span className="label-roll-container">
                    <span className="label-roll">
                      <span>{link.label}</span>
                      <span>{link.label}</span>
                    </span>
                  </span>
                </button>
              );
            }

            return (
              <button
                key={link.id || link.label}
                onClick={() => scrollToSection(link.target || link.id)}
                className="relative cursor-pointer font-normal text-sm md:text-base tracking-wide pb-1 group"
                style={{ color: 'var(--theme-text)' }}
              >
                <span>{link.label}</span>
                <span
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] transition-all"
                  style={{ backgroundColor: 'var(--theme-text)' }}
                />
              </button>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
