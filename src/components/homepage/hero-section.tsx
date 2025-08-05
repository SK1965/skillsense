'use client';

import { motion, MotionValue } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import HeroBadge from './hero-badge';
import StatsGrid from './stats-grid';
import FloatingElements from './floating-elements';

interface HeroSectionProps {
  y1: MotionValue<number>;
  y2: MotionValue<number>;
}

export default function HeroSection({ y1, y2 }: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-4">
      <div className="mx-auto text-center">
        <HeroBadge />

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold my-4 md:my-0 leading-tight md:mb-4"
        >
          <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent block">
            Your Career
          </span>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
            Supercharged
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4 md:mb-8"
        >
          AI-powered resume analysis that gets you noticed. Match any job
          description, discover skill gaps, and land your dream role faster than
          ever.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 md:mb-16"
        >
          <Link
            href="/analyze"
            className="group px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-base sm:text-lg md:text-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 sm:gap-3"
          >
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            Start Free Analysis
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <StatsGrid />
      </div>

      <FloatingElements y1={y1} y2={y2} />
    </section>
  );
}
