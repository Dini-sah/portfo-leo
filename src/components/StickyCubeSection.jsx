import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Cube3D from './Cube3D';
import { PORTFOLIO_INFO, CLIENT_LOGOS, CLIENTS_DATA, ABOUT_DATA } from '../data/portfolioData';

// Individual word for scroll reveal
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

export default function StickyCubeSection() {
  const containerRef = useRef(null);
  const statementRef = useRef(null);

  // Track scroll progress for the statement reveal inside the right column
  const { scrollYProgress: statementProgress } = useScroll({
    target: statementRef,
    offset: ["start 0.8", "end 0.4"]
  });

  const statementText = ABOUT_DATA?.statement || PORTFOLIO_INFO.introStatementBody || "";
  const statementTitle = ABOUT_DATA?.tagline || PORTFOLIO_INFO.introStatementTitle || "Hey, I'm Ralph";
  const clientsTagline = CLIENTS_DATA?.tagline || "My clients & collaborations";
  const clientsHeadline = CLIENTS_DATA?.headline || "From mobility and healthcare to finance and retail, I’ve worked with teams at —";
  const words = statementText.split(/\s+/).filter(Boolean);

  return (
    <section
      id="cube-trigger"
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28"
    >
      <div className="flex flex-col md:flex-row items-start gap-12 md:gap-16 lg:gap-20">
        {/* LEFT COLUMN: Sticky 3D Cube (Purely Scroll Driven, No Mouse Interaction) */}
        <div className="w-full md:w-[320px] lg:w-[380px] flex-shrink-0 flex justify-center md:justify-start md:sticky md:top-[180px] lg:top-[200px] z-10 py-6 md:py-0">
          <Cube3D containerRef={containerRef} />
        </div>

        {/* RIGHT COLUMN: Revealing Content (Clients & Collaborations + Scroll Reveal Statement) */}
        <div className="flex-1 w-full flex flex-col gap-28 md:gap-40 z-20">
          {/* Section 1: Clients & Collaborations */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#A670FF] text-base md:text-xl font-medium tracking-tight mb-3"
            >
              {clientsTagline}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white text-xl sm:text-2xl md:text-3xl font-light leading-relaxed mb-10 max-w-2xl"
            >
              {clientsHeadline}
            </motion.h2>

            {/* Clients Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 pt-4 border-t border-white/[0.08]">
              {CLIENT_LOGOS.map((client, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="h-12 md:h-14 flex items-center justify-start opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                >
                  <img
                    src={client.src}
                    alt={client.name}
                    className="max-h-full max-w-[140px] object-contain filter brightness-125"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section 2: Statement Scroll Reveal */}
          <div id="about" ref={statementRef} className="pt-8 border-t border-white/[0.08]">
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

            {/* Words progressively illuminate as user scrolls */}
            <div className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[46px] leading-[1.3] md:leading-[1.25] tracking-tight text-white select-none">
              {words.map((word, i) => {
                const step = 1 / words.length;
                const start = i * step;
                const end = start + step;
                return (
                  <Word key={i} progress={statementProgress} range={[start, end]}>
                    {word}
                  </Word>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
