import React from 'react';
import { PORTFOLIO_INFO, FOOTER_DATA } from '../data/portfolioData';

export default function Footer({ onCopyEmail, onOpenShowreel, onOpenResume }) {
  const tagline = FOOTER_DATA?.tagline || "Get In Touch";
  const email = FOOTER_DATA?.email || PORTFOLIO_INFO?.email || "ralfhleo@gmail.com";
  const copyHint = FOOTER_DATA?.copyHint || "Click to copy";
  const links = FOOTER_DATA?.links || [
    { id: 'showreel', label: 'Showreel', type: 'action', action: 'openShowreel' },
    { id: 'resume', label: 'Resume', type: 'action', action: 'openResume' },
    { id: 'linkedin', label: 'LinkedIn', type: 'link', url: PORTFOLIO_INFO?.linkedin || 'https://www.linkedin.com/in/ralfhleo/' }
  ];
  const copyright = FOOTER_DATA?.copyright || `© 2026 ${PORTFOLIO_INFO?.name || 'RALFH LEO'}. All rights reserved.`;

  return (
    <footer className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-12">
      {/* Left: Contact Trigger Button */}
      <div className="flex flex-col gap-4">
        <span className="text-white/40 text-xs uppercase tracking-widest font-mono">
          {tagline}
        </span>

        {/* Signature Mail Roll Button */}
        <button
          onClick={onCopyEmail}
          className="mail-btn group text-left"
          aria-label="Copy email address"
        >
          <span className="label-roll-container">
            <span className="label-roll">
              <span className="text-xl md:text-2xl font-light text-white group-hover:text-[#A670FF] transition-colors">
                Email
              </span>
              <span className="text-xl md:text-2xl font-light text-[#A670FF]">
                Email
              </span>
            </span>
          </span>

          {/* Copy Icon */}
          <svg
            className="w-5 h-5 text-white/80 group-hover:text-[#A670FF] group-hover:scale-110 transition-all ml-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </button>

        <span className="text-white/40 text-xs font-mono">
          {copyHint} {email}
        </span>
      </div>

      {/* Right: Quick Action Links & Copyright */}
      <div className="flex flex-col md:items-end gap-6">
        <div className="flex items-center gap-8 md:gap-10">
          {links.map((link) => {
            if (link.type === 'action' && link.action === 'openShowreel') {
              return (
                <button
                  key={link.id || link.label}
                  onClick={onOpenShowreel}
                  className="hover-roll-trigger cursor-pointer text-white/90 text-sm md:text-base font-normal"
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

            if (link.type === 'action' && link.action === 'openResume') {
              return (
                <button
                  key={link.id || link.label}
                  onClick={onOpenResume}
                  className="hover-roll-trigger cursor-pointer text-white/90 text-sm md:text-base font-normal"
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
              <a
                key={link.id || link.label}
                href={link.url || PORTFOLIO_INFO?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-roll-trigger cursor-pointer text-white/90 text-sm md:text-base font-normal"
              >
                <span className="label-roll-container">
                  <span className="label-roll">
                    <span>{link.label}</span>
                    <span>{link.label}</span>
                  </span>
                </span>
              </a>
            );
          })}
        </div>

        {/* Copyright notice */}
        <div className="text-white/40 text-xs font-mono tracking-tight text-left md:text-right">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
