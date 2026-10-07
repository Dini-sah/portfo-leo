import React, { useRef, forwardRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Cube3D from './Cube3D';
import { ABOUT_DATA, PORTFOLIO_INFO } from '../data/portfolioData';

// Individual word component that illuminates with scroll
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [3, 0]);

  return (
    <span className="relative inline-block mr-[0.28em] last:mr-0">
      <motion.span
        style={{
          opacity,
          y,
          color: 'var(--theme-text)',
        }}
        className="inline-block will-change-[opacity,transform]"
      >
        {children}
      </motion.span>
    </span>
  );
}

const CubeSection = forwardRef(function CubeSection(_props, ref) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const statementRef = useRef(null);

  // Dedicated scroll progress for the 3D cube rotation linked directly to the right column content
  const { scrollYProgress: cubeProgress } = useScroll({
    target: contentRef,
    offset: ["start 75%", "end 40%"]
  });

  // Dedicated scroll progress for the illuminated text reveal
  const { scrollYProgress: statementProgress } = useScroll({
    target: statementRef,
    offset: ["start 80%", "end 35%"]
  });

  const statementText = ABOUT_DATA?.statement || PORTFOLIO_INFO.introStatementBody || "";
  const statementTitle = ABOUT_DATA?.tagline || PORTFOLIO_INFO.introStatementTitle || "Hey, I'm Ralph";
  const pillars = ABOUT_DATA?.pillars || [];
  const metrics = ABOUT_DATA?.metrics || [];
  const availability = ABOUT_DATA?.availability;

  // Split into clean paragraphs preserving the natural break between thoughts
  const rawParagraphs = statementText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Tokenize each paragraph into words while keeping a unified global index for smooth reveal pacing
  const paragraphWords = rawParagraphs.map((p) => p.split(/\s+/).filter(Boolean));
  const totalWords = paragraphWords.reduce((acc, curr) => acc + curr.length, 0);
  const step = 0.85 / Math.max(1, totalWords);

  let globalWordIndex = 0;

  return (
    <section
      id="about"
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && typeof ref === 'object') {
          ref.current = node;
        }
      }}
      className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-20 md:pb-28"
    >
      <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16 lg:gap-24">
        {/* LEFT COLUMN: Sticky 3D Cube (Directly driven by content scroll) */}
        <div className="w-full md:w-[300px] lg:w-[340px] flex-shrink-0 flex justify-center md:justify-start md:sticky md:top-28 lg:top-32 z-10">
          <Cube3D progress={cubeProgress} containerRef={containerRef} />
        </div>

        {/* RIGHT COLUMN: Content (Statement + Core Pillars + Metrics) */}
        <div ref={contentRef} className="flex-1 w-full pt-2 md:pt-6 z-20">
          {/* Tagline Accent Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span
              className="text-lg md:text-xl font-medium tracking-tight"
              style={{ color: 'var(--theme-accent)' }}
            >
              {statementTitle}
            </span>
          </motion.div>

          {/* Word-by-word illuminated text reveal with proper paragraph separation */}
          <div
            ref={statementRef}
            className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.3] md:leading-[1.25] tracking-tight select-none"
          >
            {paragraphWords.map((words, pIdx) => (
              <p key={pIdx} className="mb-6 last:mb-0">
                {words.map((word, wIdx) => {
                  const i = globalWordIndex++;
                  const start = 0.05 + (i * step);
                  const end = Math.min(1, start + step * 1.8);
                  return (
                    <Word
                      key={`${pIdx}-${wIdx}-${word}`}
                      progress={statementProgress}
                      range={[start, end]}
                    >
                      {word}
                    </Word>
                  );
                })}
              </p>
            ))}
          </div>

          {/* Core Pillars Grid from Config */}
          {pillars.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-14 md:mt-20 pt-10"
              style={{ borderTop: '1px solid var(--theme-border)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                {pillars.map((pillar, pIdx) => (
                  <div key={pIdx} className="flex flex-col gap-2">
                    <span
                      className="font-mono text-xs tracking-wider uppercase font-semibold"
                      style={{ color: 'var(--theme-accent)' }}
                    >
                      {pillar.step}
                    </span>
                    <h4 className="font-display font-medium text-lg" style={{ color: 'var(--theme-text)' }}>
                      {pillar.title}
                    </h4>
                    <p className="text-xs md:text-sm leading-relaxed font-light" style={{ opacity: 0.6, color: 'var(--theme-text)' }}>
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Metrics & Availability Badge */}
              <div
                className="mt-10 md:mt-12 p-6 md:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 md:gap-8 about-metrics-card"
              >
                {metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                    {metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <div className="font-display font-bold text-2xl md:text-3xl tracking-tight" style={{ color: 'var(--theme-text)' }}>
                          {metric.value}
                        </div>
                        <div className="text-xs font-normal mt-1 leading-snug" style={{ opacity: 0.55, color: 'var(--theme-text)' }}>
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Status Badge */}
                {availability?.show !== false && availability?.text && (
                  <div
                    className="flex items-center gap-2.5 px-4 py-2 rounded-full self-start sm:self-auto about-status-badge whitespace-nowrap"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-medium tracking-tight" style={{ opacity: 0.85, color: 'var(--theme-text)' }}>
                      {availability.text}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
});

export default CubeSection;
