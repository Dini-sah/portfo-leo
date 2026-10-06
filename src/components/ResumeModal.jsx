import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Briefcase } from 'lucide-react';
import { PORTFOLIO_INFO, RESUME_DATA } from '../data/portfolioData';

export default function ResumeModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const header = RESUME_DATA?.header || {};
  const name = header.name || PORTFOLIO_INFO?.name || "RALFH LEO";
  const role = header.role || PORTFOLIO_INFO?.role || "PRODUCT DESIGNER";
  const specialization = header.specialization || "Digital Product Strategist";
  const location = header.location || PORTFOLIO_INFO?.location || "India";
  const email = header.email || PORTFOLIO_INFO?.email || "ralfhleo@gmail.com";
  const linkedinDisplay = header.linkedin || "linkedin.com/in/ralfhleo";
  const linkedinUrl = header.linkedinUrl || PORTFOLIO_INFO?.linkedin || "https://www.linkedin.com/in/ralfhleo/";
  const experienceYears = header.experience || PORTFOLIO_INFO?.experienceYears || "2+ Years";
  const workExperience = RESUME_DATA?.workExperience || [];
  const coreCompetencies = RESUME_DATA?.coreCompetencies || [];
  const toolsAndTech = RESUME_DATA?.toolsAndTech || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl my-auto bg-neutral-950 border border-white/15 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/60 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-white/60">
                Curriculum Vitae / {name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#A670FF] hover:text-black text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span>Save / Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Resume Content */}
          <div className="overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar text-white">
            {/* Header */}
            <div className="border-b border-white/10 pb-8">
              <h1 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight">
                {name}
              </h1>
              <p className="text-[#A670FF] text-lg font-normal mt-1">
                {role} · {specialization}
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-white/60 mt-4">
                <span>📍 {location}</span>
                <span>✉️ {email}</span>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  🔗 {linkedinDisplay}
                </a>
                <span>⚡ Experience: {experienceYears}</span>
              </div>
            </div>

            {/* Experience */}
            {workExperience.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6 text-sm font-mono uppercase tracking-wider text-white/50">
                  <Briefcase size={16} className="text-[#A670FF]" />
                  <span>Work Experience</span>
                </div>

                <div className="space-y-8">
                  {workExperience.map((item, idx) => (
                    <div
                      key={idx}
                      className={`border-l-2 ${idx === 0 ? 'border-[#A670FF]/50' : 'border-white/20'} pl-5 relative`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                        <h3 className="font-display font-semibold text-lg text-white">
                          {item.role}
                        </h3>
                        <span className="text-xs font-mono text-white/40">{item.period}</span>
                      </div>
                      <div className={`text-xs font-mono ${idx === 0 ? 'text-[#A670FF]' : 'text-white/60'} mb-2`}>
                        {item.company}
                      </div>
                      <p className="text-sm text-white/70 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills & Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
              {coreCompetencies.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/50 mb-4">
                    Core Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {coreCompetencies.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs text-white/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {toolsAndTech.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/50 mb-4">
                    Tools &amp; Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {toolsAndTech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-md bg-[#A670FF]/10 border border-[#A670FF]/30 text-xs text-[#A670FF]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
