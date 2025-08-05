'use client';
import { useEffect, useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { LenisRef, ReactLenis } from 'lenis/react';
import { cancelFrame, frame } from 'motion';
import Navbar from '@/components/navbar';
import BackgroundBlobs from '@/components/homepage/background-blobs';
import HeroSection from '@/components/homepage/hero-section';
import FeaturesSection from '@/components/homepage/feature-section';
import CTASection from '@/components/homepage/cta-section';

// Components

export default function Home() {
  const lenisRef = useRef<LenisRef>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {
    let rafId: number;
    const update = (data: { timestamp: number }) => {
      if (!lenisRef.current?.lenis) return;
      rafId = requestAnimationFrame(() => {
        lenisRef.current?.lenis?.raf(data.timestamp);
      });
    };
    frame.update(update, true);
    return () => {
      cancelAnimationFrame(rafId);
      cancelFrame(update);
    };
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden">
        <BackgroundBlobs />
        <Navbar />
        <HeroSection y1={y1} y2={y2} />
        <FeaturesSection />
        <CTASection />
      </div>
    </ReactLenis>
  );
}
