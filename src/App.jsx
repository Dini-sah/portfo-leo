import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CubeSection from './components/CubeSection';
import ClientsScrollSection from './components/ClientsScrollSection';
import FeaturedProjects from './components/FeaturedProjects';
import ArchiveProjects from './components/ArchiveProjects';
import OutOfOffice from './components/OutOfOffice';
import Footer from './components/Footer';
import CaseStudyModal from './components/CaseStudyModal';
import ResumeModal from './components/ResumeModal';
import ShowreelModal from './components/ShowreelModal';
import Toast from './components/Toast';
import { PORTFOLIO_INFO, METADATA } from './data/portfolioData';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Ref for the About section to track its scroll position
  const aboutSectionRef = useRef(null);

  // Dynamically synchronize page title and SEO meta description from config
  useEffect(() => {
    if (METADATA?.title) {
      document.title = METADATA.title;
    }
    if (METADATA?.description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', METADATA.description);
      }
    }
  }, []);

  const lenisRef = useRef(null);

  // Initialize Lenis buttery smooth momentum scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, []);

  // When any modal is open, completely stop Lenis and lock document scroll
  const isAnyModalOpen = Boolean(selectedProject || isResumeOpen || isShowreelOpen);
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isAnyModalOpen) {
      lenisRef.current.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenisRef.current.start();
      document.body.style.overflow = '';
    }
  }, [isAnyModalOpen]);

  // Scroll-linked color transition for the About section
  // "start end" = top of About enters bottom of viewport (scrollY = 0, initial state: black)
  // "end start" = bottom of About exits top of viewport (exiting state: black)
  const { scrollYProgress } = useScroll({
    target: aboutSectionRef,
    offset: ["start end", "end start"]
  });

  // Background color:
  // 0.00 -> 0.04: Pure black at top of Hero
  // 0.04 -> 0.22: Smooth gradual transition to white as user scrolls to About (Hero background above turns white)
  // 0.22 -> 0.78: Solid white throughout the About section
  // 0.78 -> 0.96: Smooth gradual transition back to black as About section ends
  // 0.96 -> 1.00: Pure black for subsequent sections
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.04, 0.22, 0.78, 0.96, 1],
    [
      '#000000',
      '#000000',
      '#ffffff',
      '#ffffff',
      '#000000',
      '#000000',
    ]
  );

  // Text color inverts accordingly: white -> black -> white
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.04, 0.22, 0.78, 0.96, 1],
    [
      '#ffffff',
      '#ffffff',
      '#111111',
      '#111111',
      '#ffffff',
      '#ffffff',
    ]
  );

  // Accent color subtly adapts for perfect contrast
  const accentColor = useTransform(
    scrollYProgress,
    [0, 0.04, 0.22, 0.78, 0.96, 1],
    ['#A670FF', '#A670FF', '#7C3AED', '#7C3AED', '#A670FF', '#A670FF']
  );

  // Border color adapts
  const borderColor = useTransform(
    scrollYProgress,
    [0, 0.04, 0.22, 0.78, 0.96, 1],
    [
      'rgba(255,255,255,0.1)',
      'rgba(255,255,255,0.1)',
      'rgba(0,0,0,0.1)',
      'rgba(0,0,0,0.1)',
      'rgba(255,255,255,0.1)',
      'rgba(255,255,255,0.1)',
    ]
  );

  // Keep body background color synchronized with the scroll transition
  useMotionValueEvent(bgColor, "change", (latest) => {
    document.body.style.backgroundColor = latest;
  });

  // Copy Email to Clipboard Handler
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_INFO.email).then(() => {
      setToastMessage(`Copied email ${PORTFOLIO_INFO.email}`);
      setIsToastVisible(true);
      setTimeout(() => {
        setIsToastVisible(false);
      }, 2500);
    });
  };

  return (
    <motion.div
      className="min-h-screen relative selection:bg-[#A670FF] selection:text-black font-sans"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        '--theme-bg': bgColor,
        '--theme-text': textColor,
        '--theme-accent': accentColor,
        '--theme-border': borderColor,
      }}
    >
      {/* Top Navbar */}
      <Navbar
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Section 1: Hero Section (Central Frame Wrapper + Purple Silk Backdrop) */}
        <Hero />

        {/* Section 2: Cube Section (Left Sticky Cube with NO mouse interaction + Right Content Only) */}
        <CubeSection ref={aboutSectionRef} />

        {/* Section 3: Logos Section (Horizontal Scroll respectively with Page Scroll after Cube Section) */}
        <ClientsScrollSection />

        {/* Section 4: Flagship Video Projects */}
        <FeaturedProjects onSelectProject={(p) => setSelectedProject(p)} />

        {/* Section 5: Archive & Personal Projects with Magnetic Cursor Preview */}
        <ArchiveProjects onSelectProject={(p) => setSelectedProject(p)} />

        {/* Section 6: Out of Office / 300vh Pinned Card Scatter Explosion */}
        <OutOfOffice />
      </main>

      {/* Footer with Signature Email Roll & Links */}
      <Footer
        onCopyEmail={handleCopyEmail}
        onOpenShowreel={() => setIsShowreelOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Modals & Overlays */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <ShowreelModal
        isOpen={isShowreelOpen}
        onClose={() => setIsShowreelOpen(false)}
      />

      {/* Floating Clipboard Toast */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </motion.div>
  );
}
