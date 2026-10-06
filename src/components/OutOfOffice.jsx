import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { PORTFOLIO_INFO, OUT_OF_OFFICE_PHOTOS, OUT_OF_OFFICE_DATA } from '../data/portfolioData';
import { X, MapPin } from 'lucide-react';

// Default fallback target scatter offsets
const DEFAULT_PHOTO_CONFIG = [
  { targetX: 450, targetY: 340, targetScale: 0.38, initialRotate: 3, targetRotate: 8 },
  { targetX: 400, targetY: 150, targetScale: 0.42, initialRotate: -4, targetRotate: -5 },
  { targetX: 490, targetY: -270, targetScale: 0.40, initialRotate: 5, targetRotate: 7 },
  { targetX: 230, targetY: -370, targetScale: 0.36, initialRotate: -2, targetRotate: -7 },
  { targetX: -280, targetY: 350, targetScale: 0.36, initialRotate: 4, targetRotate: 6 },
  { targetX: -500, targetY: 170, targetScale: 0.45, initialRotate: -5, targetRotate: -6 },
  { targetX: -530, targetY: -260, targetScale: 0.36, initialRotate: 2, targetRotate: 8 },
  { targetX: -350, targetY: -370, targetScale: 0.40, initialRotate: -3, targetRotate: -6 },
];

export default function OutOfOffice() {
  const trackRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [spreadFactor, setSpreadFactor] = useState(1);

  const tagline = OUT_OF_OFFICE_DATA?.tagline || PORTFOLIO_INFO.outOfOfficeTitle || "Out of Office";
  const narrative = OUT_OF_OFFICE_DATA?.narrative || PORTFOLIO_INFO.outOfOfficeSubtitle || "";
  const question = OUT_OF_OFFICE_DATA?.whyDesignQuestion || PORTFOLIO_INFO.whyDesignQuestion || "Why design? My answer is simple.";
  const answer = OUT_OF_OFFICE_DATA?.whyDesignAnswer || PORTFOLIO_INFO.whyDesignAnswer || "";
  const scrollPrompt = OUT_OF_OFFICE_DATA?.scrollPrompt || "Scroll to explore";

  // Responsive spread factor to fit any screen resolution
  useEffect(() => {
    const updateSpread = () => {
      const w = window.innerWidth;
      if (w < 640) setSpreadFactor(0.45);
      else if (w < 1024) setSpreadFactor(0.70);
      else if (w < 1440) setSpreadFactor(0.90);
      else setSpreadFactor(1.05);
    };
    updateSpread();
    window.addEventListener('resize', updateSpread);
    return () => window.removeEventListener('resize', updateSpread);
  }, []);

  // Track scroll progress across a 220vh runway for continuous scroll tracking
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  // Center text reveals continuously as photos spread outward
  const textOpacity = useTransform(scrollYProgress, [0.08, 0.65, 0.92, 1], [0, 1, 1, 0.4]);
  const textScale = useTransform(scrollYProgress, [0.08, 0.65, 0.92, 1], [0.90, 1, 1, 0.95]);

  return (
    <section
      id="out-of-office"
      ref={trackRef}
      className="relative w-full h-[220vh] bg-black"
    >
      {/* Sticky 100vh Viewport Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center px-6 md:px-12 z-10">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-black to-black opacity-80 pointer-events-none" />

        {/* Center Philosophy Narrative Content (Reveals directly as photos fly outward) */}
        <motion.div
          style={{ scale: textScale, opacity: textOpacity }}
          className="relative z-20 max-w-3xl mx-auto text-center pointer-events-auto px-6 py-8"
        >
          {/* Section Tag */}
          <div className="text-[#A670FF] text-base md:text-xl font-medium tracking-tight mb-4">
            {tagline}
          </div>

          {/* Travel Narrative */}
          {narrative && (
            <p className="font-display font-light text-base sm:text-lg md:text-[20px] text-[#CCCCCC] leading-[1.4] max-w-2xl mx-auto mb-8 text-center">
              {narrative}
            </p>
          )}

          {/* Philosophy Statement */}
          {(question || answer) && (
            <div className="pt-6 border-t border-white/10 max-w-xl mx-auto">
              {question && (
                <h3 className="font-display font-light text-lg sm:text-xl md:text-[20px] text-[#CCCCCC] leading-[1.4] mb-3 text-center">
                  {question}
                </h3>
              )}
              {answer && (
                <p className="font-display font-light text-base sm:text-lg md:text-[20px] text-[#CCCCCC] leading-[1.4] text-center">
                  {answer}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Scattered Photos: Spreads continuously and proportionally with user scroll */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {OUT_OF_OFFICE_PHOTOS.map((photo, i) => {
            const fallbackConfig = DEFAULT_PHOTO_CONFIG[i % DEFAULT_PHOTO_CONFIG.length];
            const config = {
              targetX: photo.targetX ?? fallbackConfig.targetX,
              targetY: photo.targetY ?? fallbackConfig.targetY,
              targetScale: photo.targetScale ?? fallbackConfig.targetScale,
              initialRotate: photo.initialRotate ?? fallbackConfig.initialRotate,
              targetRotate: photo.targetRotate ?? fallbackConfig.targetRotate,
            };

            return (
              <PhotoCard
                key={photo.src}
                index={i}
                photo={photo}
                config={config}
                spreadFactor={spreadFactor}
                progress={scrollYProgress}
                onSelect={() => setSelectedPhoto(photo)}
              />
            );
          })}
        </div>

        {/* Bottom Helper Indicator */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.25, 0.7, 1], [0.8, 0.4, 0, 0]) }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono tracking-widest uppercase flex items-center gap-2 pointer-events-none z-30"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#A670FF] animate-pulse" />
          <span>{scrollPrompt}</span>
        </motion.div>
      </div>

      {/* Lightbox Modal for Photo Details */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden bg-neutral-950 border border-white/20 shadow-2xl cursor-default"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#A670FF] hover:text-black transition-colors"
                aria-label="Close photo preview"
              >
                <X size={18} />
              </button>
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.location}
                className="w-full max-h-[68vh] object-cover"
              />
              <div className="p-6 bg-neutral-950 flex flex-col gap-1">
                <span className="text-[#A670FF] text-sm font-mono flex items-center gap-1.5">
                  <MapPin size={14} />
                  {selectedPhoto.location}
                </span>
                <p className="text-white/80 text-sm font-light">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Individual Photo Card animating from center out to exact target coordinates
function PhotoCard({ photo, config, spreadFactor, progress, onSelect }) {
  // Spreads continuously and proportionally with scroll from 0 -> 0.85
  const x = useTransform(
    progress,
    [0, 0.85],
    [0, config.targetX * spreadFactor]
  );

  const y = useTransform(
    progress,
    [0, 0.85],
    [0, config.targetY * spreadFactor]
  );

  const scale = useTransform(
    progress,
    [0, 0.85],
    [1.0, config.targetScale]
  );

  const rotate = useTransform(
    progress,
    [0, 0.85],
    [config.initialRotate, config.targetRotate]
  );

  return (
    <motion.div
      style={{
        x,
        y,
        scale,
        rotate,
      }}
      onClick={onSelect}
      className="absolute w-[340px] sm:w-[400px] md:w-[445px] aspect-square rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/20 bg-neutral-900 pointer-events-auto cursor-pointer hover:!scale-[1.1] hover:!z-50 hover:border-[#A670FF]/60 transition-all duration-300 will-change-transform"
    >
      <img
        src={photo.src}
        alt={photo.location}
        className="w-full h-full object-cover select-none pointer-events-none"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <span className="text-xs text-white font-medium flex items-center gap-1.5">
          <MapPin size={12} className="text-[#A670FF]" />
          {photo.location}
        </span>
      </div>
    </motion.div>
  );
}
