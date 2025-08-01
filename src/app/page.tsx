'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LenisRef, ReactLenis } from 'lenis/react';
import { cancelFrame, frame } from 'motion';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { feedbackItems } from '@/data/feedbackData';
import HowItWorksSection from '@/components/how-it-works';
import { Navbar } from '@/components/navbar';
import ResumeJDForm from '@/components/resume-jd-form';
import Image from 'next/image';
export default function Home() {
  const lenisRef = useRef<LenisRef>(null);

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
      <div className="relative w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
        <Navbar />

        {/* Decorative vertical lines with softer gradient and blur */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-40 blur-sm" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-40 blur-sm" />
        {/* Bottom accent line */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70" />

        <main className="mx-auto max-w-7xl px-6 sm:px-10 py-24 flex flex-col items-center">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center font-extrabold bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight max-w-4xl"
          >
            AI-Powered Resume Analysis & Skill Matching
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-8 max-w-3xl text-center text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed"
          >
            SkillSense helps you instantly analyze your resume with AI, match it
            with any job description, and receive targeted suggestions to boost
            your chances.
          </motion.p>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.85 }}
            className="mt-12 w-full max-w-3xl shadow-lg rounded-xl bg-white dark:bg-neutral-800 p-8"
          >
            <ResumeJDForm />
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-20 max-w-6xl rounded-3xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden"
          >
            <Image
              src="https://res.cloudinary.com/dolb0no3p/image/upload/v1753967724/hero.png"
              alt="Resume Analyzer"
              layout="responsive" // Ensures the image adapts based on the container's width
              height={600}
              width={900}
              unoptimized // Disable image optimization (since it's external)
              className="object-cover"
              draggable={false}
              sizes="(max-width: 768px) 100vw, 50vw" // Responsively adjusts based on screen width
            />
          </motion.div>

          {/* How it works */}
          <div className="w-full max-w-7xl mt-28">
            <HowItWorksSection />
          </div>

          {/* Feedback */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.6 }}
            className="relative z-10 mt-20 w-full max-w-7xl rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
          >
            <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              What Experts Say
            </h2>

            <InfiniteMovingCards items={feedbackItems} />
          </motion.section>
        </main>
      </div>
    </ReactLenis>
  );
}
