import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NAVBAR_DATA, PORTFOLIO_INFO } from '../data/portfolioData';

export default function Navbar({ onOpenResume }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const workEl = document.getElementById('work');
      if (workEl) {
        const rect = workEl.getBoundingClientRect();
        // Section is active when its top is within viewport upper section and bottom is still in view
        const isInWork = rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.15;
        setActiveSection(isInWork ? 'work' : null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setActiveSection(null);
  };

  const brandName = NAVBAR_DATA?.name || PORTFOLIO_INFO?.name || 'RALFH LEO';
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
        {/* Left: Brand Name (No borders) */}
        <button
          onClick={scrollToTop}
          className="cursor-pointer tracking-wider font-semibold text-sm md:text-base uppercase bg-transparent p-0 border-none outline-none transition-opacity duration-200 hover:opacity-75 flex items-center"
          style={{
            color: 'var(--theme-text)',
          }}
          aria-label="Home"
        >
          <span className="font-display font-medium text-sm md:text-base tracking-widest uppercase">
            {brandName}
          </span>
        </button>

        {/* Right: Nav Links dynamically loaded from config */}
        <nav className="flex items-center gap-8 md:gap-10">
          {links.map((link) => {
            const isAction = link.type === 'action';
            const isWork = link.target === 'work' || link.id === 'work';
            const isActive = isWork && activeSection === 'work';

            const handleClick = () => {
              if (isAction && link.action === 'openResume') {
                onOpenResume?.();
              } else {
                if (isWork) setActiveSection('work');
                scrollToSection(link.target || link.id);
              }
            };

            return (
              <button
                key={link.id || link.label}
                onClick={handleClick}
                className="hover-roll-trigger cursor-pointer text-sm md:text-base font-normal tracking-wide relative flex flex-col items-center bg-transparent border-none p-0 outline-none"
                style={{ color: 'var(--theme-text)' }}
              >
                <span
                  className={`label-roll-container ${isActive ? 'is-active' : ''}`}
                  style={{
                    borderBottomColor: isActive ? 'var(--theme-text)' : undefined,
                  }}
                >
                  <span className="label-roll">
                    <span>{link.label}</span>
                    <span>{link.label}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
