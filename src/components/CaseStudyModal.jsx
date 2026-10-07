import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

export default function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-hidden"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          data-lenis-prevent="true"
          className="relative w-full max-w-5xl my-auto bg-neutral-950 border border-white/15 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] h-full flex flex-col pointer-events-auto"
        >
          {/* Top Bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/80 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A670FF]" />
              <span className="text-xs uppercase font-mono tracking-wider text-white/60">
                {project.category || project.type}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div
            data-lenis-prevent="true"
            className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar overscroll-contain"
          >
            {/* Header section */}
            <div>
              <div className="flex items-center justify-between text-sm font-mono text-white/40 mb-2">
                <span>{project.year}</span>
                {project.role && <span>{project.role}</span>}
              </div>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight">
                {project.title}
              </h2>
              {project.tagline && (
                <p className="text-lg md:text-xl text-[#A670FF] mt-2 font-light">
                  {project.tagline}
                </p>
              )}
            </div>

            {/* Media Showcase: Video or Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg">
              {project.video ? (
                <video
                  src={project.video}
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Impact Metrics (if available) */}
            {project.metrics && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col"
                  >
                    <span className="font-display font-bold text-2xl md:text-3xl text-[#A670FF]">
                      {m.value}
                    </span>
                    <span className="text-xs md:text-sm text-white/60 font-light mt-1">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Summary & Narrative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white/80 font-light leading-relaxed">
              <div>
                <h4 className="text-sm font-mono uppercase tracking-wider text-white mb-3">
                  The Challenge
                </h4>
                <p className="text-sm md:text-base text-white/70">
                  {project.challenge || project.description}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-mono uppercase tracking-wider text-[#A670FF] mb-3">
                  The Design Solution
                </h4>
                <p className="text-sm md:text-base text-white/70">
                  {project.solution || project.details}
                </p>
              </div>
            </div>

            {/* Key Features */}
            {project.features && (
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-mono uppercase tracking-wider text-white mb-4">
                  Key System Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3 text-sm text-white/80 font-light">
                      <CheckCircle2 size={16} className="text-[#A670FF] flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
