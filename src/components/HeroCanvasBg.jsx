import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * HeroCanvasBg
 * Moving violet silk & ambient glow background animation.
 * Features fluid undulating waves of radiant violet (#a570fd).
 * Fully transparent to allow the page background to seamlessly switch to white on scroll like the previous version.
 * Fades out smoothly as the user scrolls into the white About section.
 */
export default function HeroCanvasBg() {
  const canvasRef = useRef(null);
  const { scrollY } = useScroll();

  // Smoothly fade canvas opacity as user scrolls away from hero towards the white About section
  const canvasOpacity = useTransform(scrollY, [0, 420], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    let t = 0;

    const render = () => {
      // Fluid, natural moving wave speed
      t += 0.007;

      // Transparent clear — ensures the dynamic page background (black switching to white) shows through completely
      ctx.clearRect(0, 0, width, height);

      // 1. Moving Upper-Right Violet Aura (flowing and breathing)
      const aura1X = width * 0.72 + Math.sin(t * 0.7) * 45 + Math.cos(t * 0.4) * 25;
      const aura1Y = height * 0.28 + Math.cos(t * 0.5) * 35 + Math.sin(t * 0.3) * 20;
      const aura1Radius = Math.min(width, height) * (0.52 + Math.sin(t * 0.6) * 0.05);

      const grad1 = ctx.createRadialGradient(aura1X, aura1Y, 0, aura1X, aura1Y, aura1Radius);
      grad1.addColorStop(0, 'rgba(165, 112, 253, 0.42)');   // Radiant violet (#a570fd)
      grad1.addColorStop(0.35, 'rgba(139, 92, 246, 0.22)'); // Soft violet
      grad1.addColorStop(0.7, 'rgba(124, 58, 237, 0.08)');  // Deep violet
      grad1.addColorStop(1, 'rgba(165, 112, 253, 0)');

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Dynamic Fluid Silk Wave (undulating across the upper-right corner)
      ctx.save();
      ctx.beginPath();
      const waveShift1 = Math.sin(t * 0.9) * 35;
      const waveShift2 = Math.cos(t * 0.7) * 30;
      ctx.moveTo(width * 0.35, 0);
      ctx.bezierCurveTo(
        width * 0.55 + waveShift1, height * 0.10 + waveShift2,
        width * 0.75 - waveShift2, height * 0.22 + waveShift1,
        width, height * 0.38 + waveShift2
      );
      ctx.lineTo(width, 0);
      ctx.closePath();

      const waveGrad = ctx.createLinearGradient(width * 0.4, 0, width, height * 0.38);
      waveGrad.addColorStop(0, 'rgba(165, 112, 253, 0.32)');
      waveGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.18)');
      waveGrad.addColorStop(1, 'rgba(165, 112, 253, 0)');

      ctx.fillStyle = waveGrad;
      ctx.filter = 'blur(36px)';
      ctx.fill();
      ctx.restore();

      // 3. Second Intersecting Fluid Wave for rich organic silk motion
      ctx.save();
      ctx.beginPath();
      const wave2Shift = Math.sin(t * 0.6 + 1.5) * 40;
      ctx.moveTo(width * 0.48, 0);
      ctx.bezierCurveTo(
        width * 0.66 + wave2Shift, height * 0.16 - wave2Shift * 0.5,
        width * 0.82, height * 0.28 + wave2Shift,
        width, height * 0.52
      );
      ctx.lineTo(width, 0);
      ctx.closePath();

      const wave2Grad = ctx.createLinearGradient(width * 0.5, 0, width, height * 0.52);
      wave2Grad.addColorStop(0, 'rgba(196, 155, 255, 0.26)');
      wave2Grad.addColorStop(0.6, 'rgba(147, 51, 234, 0.14)');
      wave2Grad.addColorStop(1, 'rgba(196, 155, 255, 0)');

      ctx.fillStyle = wave2Grad;
      ctx.filter = 'blur(42px)';
      ctx.fill();
      ctx.restore();

      // 4. Moving Center-Left Violet Ambient Glow (Counterbalance)
      const aura2X = width * 0.18 + Math.cos(t * 0.5) * 30;
      const aura2Y = height * 0.65 + Math.sin(t * 0.7) * 25;
      const aura2Radius = Math.min(width, height) * (0.40 + Math.cos(t * 0.4) * 0.04);

      const grad2 = ctx.createRadialGradient(aura2X, aura2Y, 0, aura2X, aura2Y, aura2Radius);
      grad2.addColorStop(0, 'rgba(139, 92, 246, 0.20)');
      grad2.addColorStop(0.5, 'rgba(91, 33, 182, 0.08)');
      grad2.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 5. Flowing Silk Ribbon Beam across the upper canvas
      ctx.save();
      ctx.beginPath();
      const arcSway = Math.sin(t * 0.6) * 22;
      ctx.moveTo(width * 0.55, 0);
      ctx.bezierCurveTo(
        width * 0.70 + arcSway, height * 0.16 + arcSway,
        width * 0.88 - arcSway * 0.5, height * 0.22,
        width, height * 0.28 + arcSway * 0.5
      );
      ctx.strokeStyle = 'rgba(165, 112, 253, 0.26)';
      ctx.lineWidth = 50;
      ctx.filter = 'blur(28px)';
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ opacity: canvasOpacity }}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
