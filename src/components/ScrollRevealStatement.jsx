import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PORTFOLIO_INFO, ABOUT_DATA } from '../data/portfolioData';

// Individual Word with scroll-driven reveal
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const blur = useTransform(progress, range, [4, 0]);

  return (
    <span className="relative inline-block mr-[0.28em] last:mr-0">
      <motion.span
        style={{
          opacity,
          filter: useTransform(blur, (b) => `blur(${b}px)`),
        }}
        className="inline-block text-white"
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function ScrollRevealStatement() {
  const trackRef = useRef(null);

  // Track scroll progress across the 220vh track
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  const statementTitle = ABOUT_DATA?.tagline || PORTFOLIO_INFO.introStatementTitle || "Hey, I'm Ralph";
  const statementBody = ABOUT_DATA?.statement || PORTFOLIO_INFO.introStatementBody || "";
  const words = statementBody.split(/\s+/).filter(Boolean);

  return (
    <div ref={trackRef} className="relative w-full h-[220vh] bg-black">
      {/* Sticky Fullscreen Viewport Pin */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center px-6 md:px-12 pointer-events-none">
        <div className="max-w-5xl mx-auto w-full pointer-events-auto">
          {/* Intro Subtitle in Signature Neon Lilac */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-8"
          >
            <span className="text-[#A670FF] text-xl md:text-2xl font-medium tracking-tight">
              {statementTitle}
            </span>
          </motion.div>

          {/* Word-by-word illuminated statement */}
          <div className="font-display font-medium text-2xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.3] md:leading-[1.25] tracking-tight text-white select-none">
            {words.map((word, i) => {
              // Word illumination progresses across 15% to 85% of track
              const step = 0.7 / words.length;
              const start = 0.15 + (i * step);
              const end = start + step;
              return (
                <Word key={i} progress={scrollYProgress} range={[start, end]}>
                  {word}
                </Word>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
