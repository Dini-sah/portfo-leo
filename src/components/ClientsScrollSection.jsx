import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CLIENT_LOGOS, CLIENTS_DATA } from '../data/portfolioData';

export default function ClientsScrollSection() {
  const sectionRef = useRef(null);

  // Directly link horizontal translation to vertical page scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Reference target: x: 1500 -> -500 (smoothly translates across viewport as user scrolls)
  const rawX = useTransform(scrollYProgress, [0, 1], [400, -750]);
  const smoothX = useSpring(rawX, { stiffness: 80, damping: 25 });

  // Triple logos to ensure full horizontal runway
  const logosList = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  const tagline = CLIENTS_DATA?.tagline || "My clients & collaborations";
  const headline = CLIENTS_DATA?.headline || "From mobility and healthcare to finance and retail, I've worked with teams at —";

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 relative overflow-hidden"
      style={{
        borderTop: '1px solid var(--theme-border)',
        borderBottom: '1px solid var(--theme-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        {/* Accent Tag */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-base md:text-xl font-medium tracking-tight mb-3"
          style={{ color: 'var(--theme-accent)' }}
        >
          {tagline}
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed max-w-2xl"
          style={{ color: 'var(--theme-text)' }}
        >
          {headline}
        </motion.h2>
      </div>

      {/* Horizontal Scroll Track (Scrolls horizontally respectively with page scroll) */}
      <div className="relative w-full overflow-hidden py-8">
        {/* Left Fade Mask */}
        <div
          className="absolute top-0 bottom-0 left-0 w-24 md:w-56 z-10 pointer-events-none clients-fade-left"
        />

        {/* Right Fade Mask */}
        <div
          className="absolute top-0 bottom-0 right-0 w-24 md:w-56 z-10 pointer-events-none clients-fade-right"
        />

        {/* Horizontal Row moving with page scroll */}
        <motion.div
          style={{ x: smoothX }}
          className="flex items-center gap-14 md:gap-24 w-max will-change-transform pl-12"
        >
          {logosList.map((logo, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 h-10 md:h-14 w-36 md:w-48 flex items-center justify-center opacity-65 hover:opacity-100 transition-opacity cursor-pointer clients-logo-item"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="max-h-full max-w-full object-contain select-none pointer-events-none"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
