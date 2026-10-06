import React, { useEffect, useRef } from 'react';

export default function HeroCanvasBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const render = () => {
      t += 0.004;
      const w = canvas.width;
      const h = canvas.height;

      // Transparent clear — allows the dynamic page background (black or white) to show through
      ctx.clearRect(0, 0, w, h);

      // 1. Top Right Purple Light Beam
      const trGrad = ctx.createLinearGradient(w * 0.5, 0, w, h * 0.4);
      trGrad.addColorStop(0, 'rgba(120, 40, 200, 0.45)');
      trGrad.addColorStop(0.4, 'rgba(80, 20, 150, 0.25)');
      trGrad.addColorStop(1, 'rgba(120, 40, 200, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(w * 0.4, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h * 0.6);
      ctx.lineTo(w * 0.5, h * 0.3);
      ctx.closePath();
      ctx.fillStyle = trGrad;
      ctx.filter = 'blur(40px)';
      ctx.fill();
      ctx.restore();

      // Top right diagonal silk wave
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(w * 0.6, 0);
      ctx.bezierCurveTo(w * 0.75, h * 0.15, w * 0.85, h * 0.25, w, h * 0.35);
      ctx.lineTo(w, 0);
      ctx.closePath();
      const waveGrad = ctx.createLinearGradient(w * 0.6, 0, w, h * 0.35);
      waveGrad.addColorStop(0, 'rgba(166, 112, 255, 0.35)');
      waveGrad.addColorStop(0.5, 'rgba(120, 40, 200, 0.3)');
      waveGrad.addColorStop(1, 'rgba(166, 112, 255, 0)');
      ctx.fillStyle = waveGrad;
      ctx.filter = 'blur(25px)';
      ctx.fill();
      ctx.restore();

      // 2. Left Curving 3D Silk Torus / Ribbon
      ctx.save();
      ctx.beginPath();
      // Draw a sweeping 3D ribbon loop on the left
      const sway = Math.sin(t) * 15;
      ctx.ellipse(w * 0.04 + sway, h * 0.5, w * 0.16, h * 0.48, Math.PI * 0.08, 0, Math.PI * 2);
      ctx.lineWidth = Math.min(w * 0.08, 90);
      const ribbonGrad = ctx.createLinearGradient(0, h * 0.1, w * 0.2, h * 0.9);
      ribbonGrad.addColorStop(0, 'rgba(140, 60, 240, 0.15)');
      ribbonGrad.addColorStop(0.3, 'rgba(166, 112, 255, 0.65)');
      ribbonGrad.addColorStop(0.6, 'rgba(120, 40, 200, 0.7)');
      ribbonGrad.addColorStop(1, 'rgba(90, 25, 170, 0.2)');
      ctx.strokeStyle = ribbonGrad;
      ctx.filter = 'blur(35px)';
      ctx.stroke();
      ctx.restore();

      // Secondary tighter ribbon core for depth
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(w * 0.05 + sway * 0.7, h * 0.52, w * 0.12, h * 0.42, Math.PI * 0.08, 0, Math.PI * 2);
      ctx.lineWidth = Math.min(w * 0.04, 45);
      const coreGrad = ctx.createLinearGradient(0, h * 0.2, w * 0.15, h * 0.8);
      coreGrad.addColorStop(0, 'rgba(166, 112, 255, 0)');
      coreGrad.addColorStop(0.4, 'rgba(186, 138, 255, 0.6)');
      coreGrad.addColorStop(0.7, 'rgba(140, 60, 240, 0.65)');
      coreGrad.addColorStop(1, 'rgba(100, 30, 180, 0)');
      ctx.strokeStyle = coreGrad;
      ctx.filter = 'blur(18px)';
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
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
