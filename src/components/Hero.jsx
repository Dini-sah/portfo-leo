import React from 'react';
import { motion } from 'framer-motion';
import HeroCanvasBg from './HeroCanvasBg';
import { PORTFOLIO_INFO } from '../data/portfolioData';

export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 overflow-hidden bg-black">
      {/* Moving Violet Silk Mesh Shader Canvas Background */}
      <HeroCanvasBg />

      {/* Exact Central Frame Wrapper matching reference screenshot - keeps its distinct dark luxury frame styling */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-6xl mx-auto border border-white/20 bg-black/50 backdrop-blur-md p-8 sm:p-12 md:p-16 rounded-none flex flex-col justify-between min-h-[420px] md:min-h-[480px] shadow-2xl text-white pointer-events-auto"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          borderColor: 'rgba(255, 255, 255, 0.22)',
          color: '#ffffff',
        }}
      >
        {/* 4 Corner Anchors / Handles matching reference screenshot */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#AAAAAA] z-20 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#AAAAAA] z-20 pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#AAAAAA] z-20 pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#AAAAAA] z-20 pointer-events-none" />

        {/* Top Tag: (Currently at Onething Design) */}
        <div className="text-center w-full mb-6">
          <span className="text-white text-xs md:text-[13px] font-medium tracking-wide">
            {PORTFOLIO_INFO.experienceTag}
          </span>
        </div>

        {/* Center: PRODUCT DESIGNER & Bio Subtitle */}
        <div className="flex flex-col items-center justify-center text-center my-auto py-4">
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-[76px] xl:text-[92px] 2xl:text-[104px] tracking-tight text-[#EEEEEE] leading-[0.96] uppercase select-none w-full">
            {PORTFOLIO_INFO.role}
          </h1>

          <p className="mt-6 md:mt-8 max-w-2xl text-white/90 text-xs sm:text-sm md:text-[14px] font-normal leading-[1.6] text-center px-2">
            {PORTFOLIO_INFO.bio}
          </p>
        </div>

        {/* Bottom Row: RALFH LEO & /PORTFOLIO '26 */}
        <div className="flex items-center justify-between w-full pt-8 text-[12px] md:text-[13px] font-medium text-white select-none">
          <span className="tracking-widest uppercase">{PORTFOLIO_INFO.name}</span>
          <span className="text-white/90 tracking-wide font-normal">{PORTFOLIO_INFO.year}</span>
        </div>
      </motion.div>
    </section>
  );
}
