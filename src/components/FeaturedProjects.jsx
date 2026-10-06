import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { FEATURED_PROJECTS } from '../data/portfolioData';
import { ArrowUpRight } from 'lucide-react';

function ProjectBackground({ project, index, total, scrollProgress }) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;
  const buffer = step * 0.28;

  let input = [0, 1];
  let output = [1, 1];

  if (total > 1) {
    if (index === 0) {
      input = [0, end - buffer, end, 1];
      output = [1, 1, 0, 0];
    } else if (index === total - 1) {
      input = [0, start - buffer, start, 1];
      output = [0, 0, 1, 1];
    } else {
      input = [0, start - buffer, start, end - buffer, end, 1];
      output = [0, 0, 1, 1, 0, 0];
    }
  }

  const opacity = useTransform(scrollProgress, input, output);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 w-full h-full will-change-[opacity]"
    >
      <video
        src={project.video}
        poster={project.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-110 filter brightness-[0.5] contrast-[1.05]"
      />
      <div className="absolute inset-0 backdrop-blur-[12px] bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
    </motion.div>
  );
}

function ProjectCard({ project, index, total, scrollProgress, isActive, onSelectProject }) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;
  const buffer = step * 0.28;

  let opIn = [0, 1];
  let opOut = [1, 1];
  let yIn = [0, 1];
  let yOut = [0, 0];
  let scIn = [0, 1];
  let scOut = [1, 1];

  if (total > 1) {
    if (index === 0) {
      opIn = [0, end - buffer, end, 1];
      opOut = [1, 1, 0, 0];
      yIn = [0, end - buffer, end];
      yOut = [0, 0, -28];
      scIn = [0, end - buffer, end];
      scOut = [1, 1, 0.96];
    } else if (index === total - 1) {
      opIn = [0, start - buffer, start, 1];
      opOut = [0, 0, 1, 1];
      yIn = [start - buffer, start, 1];
      yOut = [28, 0, 0];
      scIn = [start - buffer, start, 1];
      scOut = [1.04, 1, 1];
    } else {
      opIn = [0, start - buffer, start, end - buffer, end, 1];
      opOut = [0, 0, 1, 1, 0, 0];
      yIn = [start - buffer, start, end - buffer, end];
      yOut = [28, 0, 0, -28];
      scIn = [start - buffer, start, end - buffer, end];
      scOut = [1.04, 1, 1, 0.96];
    }
  }

  const opacity = useTransform(scrollProgress, opIn, opOut);
  const y = useTransform(scrollProgress, yIn, yOut);
  const scale = useTransform(scrollProgress, scIn, scOut);

  return (
    <motion.div
      style={{
        opacity,
        y,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      className="absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 px-6 sm:px-10 md:px-14 my-auto"
    >
      {/* Left Column: Project Index & Big Editorial Title */}
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
        style={{ scale }}
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

      {/* Right Column: Year / Status Typography & Explore Action */}
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
    </motion.div>
  );
}

export default function FeaturedProjects({ onSelectProject }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = Math.max(1, FEATURED_PROJECTS.length);

  // Link scroll progress across the sticky runway
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  // Dynamically update active index
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const current = Math.min(total - 1, Math.max(0, Math.floor(latest * total)));
    if (current !== activeIndex) {
      setActiveIndex(current);
    }
  });

  // Smooth scroll to a specific project within the runway
  const scrollToProject = (index) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollHeight = trackRef.current.offsetHeight - window.innerHeight;
    const targetFraction = (index + 0.5) / total;
    const targetY = scrollTop + targetFraction * scrollHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section
      id="work"
      ref={trackRef}
      style={{ height: `${Math.max(2, total) * 115}vh` }}
      className="relative w-full bg-black"
    >
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between items-center z-10">
        {/* Ambient Blurred Video Backgrounds */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
          {FEATURED_PROJECTS.map((project, idx) => (
            <ProjectBackground
              key={`bg-${project.id}`}
              project={project}
              index={idx}
              total={total}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Top spacer */}
        <div className="w-full h-16 md:h-20 flex-shrink-0" />

        {/* Main Foreground Container */}
        <div className="relative z-20 w-full max-w-[1520px] mx-auto px-6 sm:px-10 md:px-14 flex-1 flex items-center justify-center">
          {FEATURED_PROJECTS.map((project, idx) => (
            <ProjectCard
              key={`content-${project.id}`}
              project={project}
              index={idx}
              total={total}
              scrollProgress={scrollYProgress}
              isActive={activeIndex === idx}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>

        {/* Bottom Interactive Navigation */}
        <div className="relative z-30 w-full max-w-[1520px] mx-auto px-6 sm:px-10 md:px-14 pb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {FEATURED_PROJECTS.map((project, idx) => (
              <button
                key={`nav-${project.id}`}
                onClick={() => scrollToProject(idx)}
                className={`group flex items-center gap-2 py-1.5 px-3 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? 'bg-white/15 border border-white/25 text-white'
                    : 'bg-transparent border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                }`}
                aria-label={`Jump to project 0${idx + 1}`}
              >
                <span className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-6 bg-[#A670FF]' : 'w-1.5 bg-white/40 group-hover:bg-white/70'
                }`} />
                <span className="font-mono text-xs hidden sm:inline-block">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          <span className="text-white/40 font-mono text-[11px] md:text-xs tracking-wider uppercase">
            Scroll to explore · 0{activeIndex + 1} / 0{total}
          </span>
        </div>
      </div>
    </section>
  );
}
