import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CLIENT_LOGOS, CLIENTS_DATA } from '../data/portfolioData';

export default function ClientsMarquee() {
  const sectionRef = useRef(null);

  // Link horizontal drift to scroll depth (matching Framer's x: 1500 -> -500)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scrollX = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const smoothX = useSpring(scrollX, { stiffness: 80, damping: 25 });

  const marqueeItems = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  const tagline = CLIENTS_DATA?.tagline || "My clients & collaborations";
  const headline = CLIENTS_DATA?.headline || "From mobility and healthcare to finance and retail, I’ve worked with teams at —";

  return (
    <section ref={sectionRef} className="py-24 border-t border-b border-white/[0.06] bg-black/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        {/* Accent Tag */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#A670FF] text-base md:text-xl font-medium tracking-tight mb-3"
        >
          {tagline}
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white text-xl md:text-2xl font-light max-w-2xl leading-relaxed"
        >
          {headline}
        </motion.h2>
      </div>

      {/* Infinite Marquee Strip with Side Gradient Fades & Scroll Drift */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left Fade Mask */}
        <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />

        {/* Right Fade Mask */}
        <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

        {/* Ticker Content with continuous motion + scroll translation */}
        <motion.div style={{ x: smoothX }} className="flex">
          <div className="animate-marquee flex items-center gap-12 md:gap-20">
            {marqueeItems.map((logo, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 h-10 md:h-12 w-32 md:w-44 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain filter brightness-125"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
