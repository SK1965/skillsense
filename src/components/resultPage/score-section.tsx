'use client';
import { motion, AnimatePresence } from 'framer-motion';
import CircularScore from '@/components/resultPage/circular-score';

interface ScoreSectionProps {
  score: number;
  matchScore: number;
}

export default function ScoreSection({ score, matchScore }: ScoreSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12 }}
      className="flex flex-col items-center"
    >
      <p className="text-base sm:text-lg mb-3 text-neutral-700 dark:text-neutral-200">
        Your Resume&apos;s Job Match:
      </p>
      <CircularScore score={score} />
      <AnimatePresence>
        {matchScore < 80 ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-base text-amber-600 dark:text-yellow-400 font-semibold"
          >
            Good! But you can still improve your fit.
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-base text-green-600 dark:text-green-300 font-semibold"
          >
            Excellent Fit!
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
