import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARCHIVE_PROJECTS, ARCHIVE_DATA } from '../data/portfolioData';
import { ArrowUpRight } from 'lucide-react';

export default function ArchiveProjects({ onSelectProject }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const tagline = ARCHIVE_DATA?.tagline || "There’s more";
  const headline = ARCHIVE_DATA?.headline || "Work work workk";

  const handleMouseMove = (e, rowRect) => {
    // Relative position inside the hovered row [-1 to 1]
    const relX = (e.clientX - (rowRect.left + rowRect.width * 0.6)) / (rowRect.width * 0.2);
    const relY = (e.clientY - (rowRect.top + rowRect.height / 2)) / (rowRect.height / 2);
    setMouseOffset({
      x: Math.max(-18, Math.min(18, relX * 14)),
      y: Math.max(-12, Math.min(12, relY * 10)),
    });
  };

  return (
    <section
      id="archive"
      className="py-24 md:py-36 px-6 sm:px-10 md:px-14 max-w-7xl mx-auto border-t border-white/[0.08] relative"
    >
      {/* Header section matching Framer reference */}
      <div className="mb-14 md:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#A670FF] text-base md:text-xl font-medium tracking-tight mb-2"
        >
          {tagline}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-medium text-3xl sm:text-4xl md:text-[38px] text-[#EEEEEE] tracking-tight"
        >
          {headline}
        </motion.h2>
      </div>

      {/* Projects List: Exactly matching Framer reference with row-anchored hover image reveal */}
      <div className="border-t border-white/20 divide-y divide-white/20">
        {ARCHIVE_PROJECTS.map((item) => {
          const isHovered = hoveredId === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={(e) => {
                setHoveredId(item.id);
                const rect = e.currentTarget.getBoundingClientRect();
                handleMouseMove(e, rect);
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleMouseMove(e, rect);
              }}
              onMouseLeave={() => {
                setHoveredId(null);
                setMouseOffset({ x: 0, y: 0 });
              }}
              onClick={() => onSelectProject(item)}
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-6 md:py-8 cursor-pointer transition-colors duration-300 hover:bg-white/[0.02] px-3 md:px-6 -mx-3 md:-mx-6 rounded-xl select-none"
            >
              {/* Left Column: Title & Index Number */}
              <div className="flex items-baseline gap-4 md:gap-8 z-10">
                <span className="font-mono text-xs md:text-sm text-neutral-400 tracking-wider">
                  {item.num}
                </span>
                <h3 className="font-display text-xl sm:text-2xl md:text-[26px] font-normal text-[#EEEEEE] group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                  {item.title}
                </h3>
                {item.isLive && (
                  <span className="px-2 py-0.5 rounded-full bg-[#DF3B3B] text-white text-[10px] uppercase font-semibold tracking-wider self-center">
                    Live
                  </span>
                )}
              </div>

              {/* Center-Right: In-Row Floating Image Reveal on Hover (Matching Framer reference) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: mouseOffset.x,
                      y: mouseOffset.y,
                    }}
                    exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.15 } }}
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 26,
                    }}
                    style={{
                      left: 'calc(60% - 150px)',
                      top: 'calc(50% - 95px)',
                    }}
                    className="hidden lg:block absolute pointer-events-none z-30 w-[300px] h-[190px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/20 bg-neutral-900"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Right Column: Year, Tag & Arrow */}
              <div className="flex items-center gap-6 mt-3 md:mt-0 pl-8 md:pl-0 z-10 flex-shrink-0">
                <span className="text-[#EEEEEE]/80 text-sm md:text-base font-light">
                  {item.year}
                </span>
                <span className="text-white/60 text-xs md:text-sm font-light hidden sm:inline-block">
                  /{item.type}
                </span>
                <span className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 group-hover:border-[#A670FF] group-hover:bg-[#A670FF] group-hover:text-black transition-all duration-300">
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
