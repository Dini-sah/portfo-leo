import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { FEATURED_PROJECTS } from '../data/portfolioData';
import { ArrowUpRight } from 'lucide-react';

function StickyProjectCard({
  project,
  index,
  total,
  scrollYProgress,
  onSelectProject,
  onJumpToProject,
  activeGlobalIndex,
}) {
  const step = 1 / total;
  const coverStart = index * step;
  const coverEnd = (index + 1) * step;

  // Scale down, dim, and drift upward when this card is being covered by the next card (or next section)
  const scale = useTransform(
    scrollYProgress,
    [0, coverStart, coverEnd, 1],
    [1, 1, 0.94, 0.94]
  );

  const y = useTransform(
    scrollYProgress,
    [0, coverStart, coverEnd, 1],
    [0, 0, -35, -35]
  );

  const dimOpacity = useTransform(
    scrollYProgress,
    [0, coverStart, coverEnd, 1],
    [0, 0, 0.55, 0.55]
  );

  // Parallax subtle vertical movement on media for incoming cards
  const entryStart = Math.max(0, (index - 1) * step);
  const entryEnd = index * step;
  const mediaParallaxY = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 1]
      : [0, entryStart, entryEnd, 1],
    index === 0
      ? [0, 0]
      : [30, 30, 0, 0]
  );

  return (
    <div
      style={{
        zIndex: 10 + index * 10,
      }}
      className={`sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-black flex flex-col justify-between items-center ${
        index > 0 ? 'border-t border-white/15 shadow-[0_-30px_90px_rgba(0,0,0,0.95)]' : ''
      }`}
    >
      {/* 1. Ambient Blurred Video Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
        <video
          src={project.video}
          poster={project.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] contrast-[1.05]"
        />
        <div className="absolute inset-0 backdrop-blur-[14px] bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/85" />
      </div>

      {/* 2. Dark Overlay when card is being stacked over */}
      <motion.div
        style={{ opacity: dimOpacity }}
        className="absolute inset-0 bg-black pointer-events-none z-20"
      />

      {/* 3. Main Content Container (with scale & y parallax transforms) */}
      <motion.div
        style={{ scale, y }}
        className="relative z-10 w-full h-full flex flex-col justify-between items-center py-6 sm:py-8 md:py-10"
      >
        {/* Top spacer for navbar clearance */}
        <div className="w-full h-16 md:h-20 flex-shrink-0" />

        {/* 3-Column Editorial Grid matching Framer reference */}
        <div className="relative z-10 w-full max-w-[1520px] mx-auto px-6 sm:px-10 md:px-14 flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 my-auto">
          {/* Left Column: Index, Category & Big Title */}
          <div className="flex-1 w-full lg:max-w-[440px] text-left self-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs md:text-sm text-[#A670FF] font-semibold tracking-widest uppercase">
                0{index + 1} / 0{total}
              </span>
              {project.category && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[11px] font-mono tracking-tight">
                  {project.category}
                </span>
              )}
            </div>

            <h2
              onClick={() => onSelectProject(project)}
              className="font-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-[-0.04em] text-white leading-[0.92] cursor-pointer hover:text-white/90 transition-colors drop-shadow-md select-none"
            >
              {project.title}
            </h2>

            {project.tagline && (
              <p className="mt-4 text-white/60 text-xs sm:text-sm max-w-sm hidden sm:block font-light leading-relaxed">
                {project.tagline}
              </p>
            )}
          </div>

          {/* Center Column: 4:3 Video Card with Case Study Trigger */}
          <motion.div
            style={{ y: mediaParallaxY }}
            onClick={() => onSelectProject(project)}
            className="group relative flex-1 w-full max-w-[560px] aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-950 border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.85)] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-[#A670FF]/60 hover:shadow-[0_0_40px_rgba(166,112,255,0.3)] self-center"
          >
            <video
              src={project.video}
              poster={project.poster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />

            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-4 py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all duration-300 group-hover:bg-[#A670FF] group-hover:text-black group-hover:border-[#A670FF] group-hover:shadow-[0_0_20px_rgba(166,112,255,0.6)]">
              <span>View Case Study</span>
              <ArrowUpRight size={14} />
            </div>
          </motion.div>

          {/* Right Column: Timeline & Explore Action */}
          <div className="flex-1 w-full lg:max-w-[280px] flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 text-right self-center">
            <div className="text-left lg:text-right">
              <span className="block text-white/40 text-[11px] font-mono uppercase tracking-wider mb-1">
                Timeline
              </span>
              <p className="font-display text-xl sm:text-2xl lg:text-3xl text-white font-normal tracking-[-0.04em]">
                {project.year}
              </p>
            </div>

            <button
              onClick={() => onSelectProject(project)}
              className="mt-0 lg:mt-5 px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-[#A670FF] hover:bg-[#A670FF]/15 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>

        {/* Bottom Interactive Navigation & Jump Controls */}
        <div className="relative z-30 w-full max-w-[1520px] mx-auto px-6 sm:px-10 md:px-14 pb-2 md:pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {FEATURED_PROJECTS.map((p, idx) => (
              <button
                key={`nav-${p.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onJumpToProject(idx);
                }}
                className={`group flex items-center gap-2 py-1.5 px-3 rounded-full transition-all duration-300 cursor-pointer ${
                  activeGlobalIndex === idx
                    ? 'bg-white/15 border border-white/25 text-white'
                    : 'bg-transparent border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                }`}
                aria-label={`Jump to project 0${idx + 1}`}
              >
                <span className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeGlobalIndex === idx ? 'w-6 bg-[#A670FF]' : 'w-1.5 bg-white/40 group-hover:bg-white/70'
                }`} />
                <span className="font-mono text-xs hidden sm:inline-block">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          <span className="text-white/40 font-mono text-[11px] md:text-xs tracking-wider uppercase">
            Scroll to explore · 0{activeGlobalIndex + 1} / 0{total}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function FeaturedProjects({ onSelectProject }) {
  const trackRef = useRef(null);
  const [activeGlobalIndex, setActiveGlobalIndex] = useState(0);
  const total = Math.max(1, FEATURED_PROJECTS.length);

  // Link scroll progress across the entire multi-card pinned runway
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  // Dynamically update active global index based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const current = Math.min(total - 1, Math.max(0, Math.floor(latest * total)));
    if (current !== activeGlobalIndex) {
      setActiveGlobalIndex(current);
    }
  });

  // Smooth scroll jump to a specific project card within the runway
  const scrollToProject = (index) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const targetY = scrollTop + index * window.innerHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section
      id="work"
      ref={trackRef}
      style={{ height: `${(total + 1) * 100}vh` }}
      className="relative w-full bg-black"
    >
      {/* Sticky Fullscreen Project Cards stacked in natural sequence */}
      {FEATURED_PROJECTS.map((project, idx) => (
        <StickyProjectCard
          key={project.id}
          project={project}
          index={idx}
          total={total}
          scrollYProgress={scrollYProgress}
          onSelectProject={onSelectProject}
          onJumpToProject={scrollToProject}
          activeGlobalIndex={activeGlobalIndex}
        />
      ))}

      {/* Spacer enabling the last project to stay pinned full-screen while the next section (Archive) scrolls UP over it */}
      <div className="h-screen w-full pointer-events-none" />
    </section>
  );
}
