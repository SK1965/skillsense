'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Enhanced Spinner with gradient and glow
const Spinner = () => (
  <div className="relative">
    <motion.div
      className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
    >
      <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full" />
    </motion.div>
    <motion.div
      className="absolute inset-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm opacity-50"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
    />
  </div>
);

// Enhanced Check with celebration animation
const Check = ({ isNew = false }: { isNew?: boolean }) => (
  <motion.div
    initial={isNew ? { scale: 0, rotate: -180 } : { scale: 1 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{
      type: 'spring',
      stiffness: 260,
      damping: 20,
      duration: 0.6,
    }}
    className="relative"
  >
    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </motion.svg>
    </div>
    {/* Success glow */}
    <div className="absolute inset-0 w-6 h-6 rounded-full bg-green-400 blur-md opacity-30" />
  </motion.div>
);

// Pending dot with subtle pulse
const PendingDot = () => (
  <motion.div
    className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
  />
);

// Progress bar component
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
    <motion.div
      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  </div>
);

// Brain/AI thinking animation
const BrainAnimation = () => (
  <div className="mb-6 flex justify-center">
    <div className="relative">
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut',
        }}
      >
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, Math.cos((i * 60 * Math.PI) / 180) * 40],
            y: [0, Math.sin((i * 60 * Math.PI) / 180) * 40],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            delay: i * 0.2,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  </div>
);

type Step = { text: string };

const LoaderCore = ({
  steps,
  current,
  loading,
}: {
  steps: Step[];
  current: number;
  loading: boolean;
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (current > 0) {
      setCompletedSteps((prev) => new Set([...prev, current - 1]));
    }
  }, [current]);

  const progress = ((current + 1) / steps.length) * 100;

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glass container */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl max-w-md w-full">
        <BrainAnimation />

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Analyzing Your Resume
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Our AI is working its magic...
          </p>
        </div>

        <ProgressBar progress={progress} />

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isPrev = index < current;
            const isCurrent = index === current;
            const isCompleted = completedSteps.has(index);

            return (
              <motion.div
                key={index}
                layout
                className="flex items-center gap-4 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {isPrev || isCompleted ? (
                    <Check
                      isNew={completedSteps.has(index) && index === current - 1}
                    />
                  ) : isCurrent ? (
                    loading ? (
                      <Spinner />
                    ) : (
                      <Check />
                    )
                  ) : (
                    <PendingDot />
                  )}
                </div>

                {/* Step Text */}
                <motion.span
                  className={cn(
                    'text-sm font-medium transition-all duration-300',
                    isPrev || isCompleted
                      ? 'text-green-600 dark:text-green-400'
                      : isCurrent
                        ? 'text-blue-600 dark:text-blue-400 font-semibold text-base'
                        : 'text-gray-400 dark:text-gray-500',
                  )}
                  animate={isCurrent ? { x: [0, 2, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {step.text}
                </motion.span>

                {/* Active step indicator */}
                {isCurrent && (
                  <motion.div
                    className="ml-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60 animate-pulse" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-40 animate-pulse" />
      </div>

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
    </motion.div>
  );
};

export const MultiStepLoader = ({
  loadingSteps,
  loading,
  baseDuration = 1200,
}: {
  loadingSteps: Step[];
  loading: boolean;
  baseDuration?: number;
}) => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Show loader with delay
  useEffect(() => {
    if (loading) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Increment steps while loading
  useEffect(() => {
    if (!loading) return;
    if (current >= loadingSteps.length - 1) return;

    const randomDelay = baseDuration + Math.floor(Math.random() * 600);
    const timeout = setTimeout(() => {
      setCurrent((prev) => Math.min(prev + 1, loadingSteps.length - 1));
    }, randomDelay);

    return () => clearTimeout(timeout);
  }, [loading, current, loadingSteps.length, baseDuration]);

  // Reset when loading stops
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setCurrent(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Loader Content */}
          <LoaderCore
            steps={loadingSteps}
            current={current}
            loading={loading}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
