import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CUBE_IMAGES, PORTFOLIO_INFO } from '../data/portfolioData';

export default function Cube3D({ progress, containerRef }) {
  // If progress is directly provided from parent content scroll, use it for zero-lag synchronization;
  // otherwise fallback to target containerRef
  const fallbackScroll = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 40%"]
  });

  const scrollProgress = progress || fallbackScroll.scrollYProgress;

  // Smooth rotation across all 4 faces (0 -> 270 degrees) matching user content scroll
  const scrollRotateY = useTransform(scrollProgress, [0, 1], [0, 270]);
  const scrollRotateX = useTransform(scrollProgress, [0, 0.5, 1], [-8, 12, -4]);

  // Buttery spring physics matching Framer's momentum
  const springY = useSpring(scrollRotateY, { stiffness: 90, damping: 28 });
  const springX = useSpring(scrollRotateX, { stiffness: 90, damping: 28 });

  const badgeText = PORTFOLIO_INFO?.cubeBadge || `${PORTFOLIO_INFO?.initials || 'RL'}·26`;

  return (
    <div
      className="perspective-container relative w-[240px] h-[240px] md:w-[280px] md:h-[280px] flex items-center justify-center select-none pointer-events-none"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic atmospheric back-glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[#A670FF]/15 blur-[90px] pointer-events-none" />

      {/* 3D Cube — Strictly responsive to scroll across all section content */}
      <motion.div
        className="cube-3d"
        style={{
          rotateY: springY,
          rotateX: springX,
        }}
      >
        {/* Front Face */}
        <div className="cube-face cube-front bg-neutral-900 border border-white/15">
          <img
            src={CUBE_IMAGES[0]?.src}
            alt={CUBE_IMAGES[0]?.alt}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Back Face */}
        <div className="cube-face cube-back bg-neutral-900 border border-white/15">
          <img
            src={CUBE_IMAGES[1]?.src}
            alt={CUBE_IMAGES[1]?.alt}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Left Face */}
        <div className="cube-face cube-left bg-neutral-900 border border-white/15">
          <img
            src={CUBE_IMAGES[2]?.src}
            alt={CUBE_IMAGES[2]?.alt}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Right Face */}
        <div className="cube-face cube-right bg-neutral-900 border border-white/15">
          <img
            src={CUBE_IMAGES[3]?.src}
            alt={CUBE_IMAGES[3]?.alt}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Top Face */}
        <div className="cube-face cube-top bg-neutral-950 flex items-center justify-center border border-white/20">
          <div className="w-14 h-14 rounded-full border border-[#A670FF]/50 flex items-center justify-center text-[#A670FF] font-mono text-xs font-bold tracking-widest">
            {badgeText}
          </div>
        </div>

        {/* Bottom Face */}
        <div className="cube-face cube-bottom bg-neutral-950 flex items-center justify-center border border-white/10">
          <div className="w-20 h-20 rounded-full bg-[#A670FF]/20 blur-md" />
        </div>
      </motion.div>
    </div>
  );
}
