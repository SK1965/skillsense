'use client';
import { motion } from 'framer-motion';

export default function ResultHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-4 sm:mb-6"
    >
      <span className="inline-block mb-2 text-4xl sm:text-5xl">🎯</span>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-600 to-green-500 inline-block text-transparent bg-clip-text">
        Resume Fit Score
      </h1>
      <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
        Instantly see how well your resume matches this job, what makes you
        stand out, and what to improve for maximum impact.
      </p>
    </motion.header>
  );
}
