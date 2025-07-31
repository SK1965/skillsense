'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Spinner
const Spinner = () => (
  <motion.div
    className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
    aria-label="Loading"
  />
)

// Check Icon
const Check = () => (
  <motion.div
    initial={{ scale: 0.7 }}
    animate={{ scale: 1 }}
    className="text-green-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </motion.div>
)

type Step = { text: string }

const LoaderCore = ({
  steps,
  current,
  loading
}: {
  steps: Step[]
  current: number
  loading: boolean
}) => {
  const visibleSteps = steps.slice(Math.max(0, current - 1), current + 2)

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {visibleSteps.map((step, i) => {
        const actualIndex = Math.max(0, current - 1) + i
        const isPrev = actualIndex < current
        const isCurrent = actualIndex === current

        return (
          <motion.div
            key={actualIndex}
            layout
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isPrev ? (
              <Check />
            ) : isCurrent ? (
              loading ? <Spinner /> : <Check />
            ) : (
              <div className="w-4 h-4 rounded-full border border-gray-400" />
            )}
            <span
              className={cn(
                'text-sm font-medium',
                isPrev
                  ? 'text-green-500'
                  : isCurrent
                  ? 'text-blue-500 text-xl'
                  : 'text-gray-400'
              )}
            >
              {step.text}
            </span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export const MultiStepLoader = ({
  loadingSteps,
  loading,
  baseDuration = 1000
}: {
  loadingSteps: Step[]
  loading: boolean
  baseDuration?: number
}) => {
  const [current, setCurrent] = useState(0)

  // Increment steps while loading, but never above last step
  useEffect(() => {
    if (!loading) return
    if (current >= loadingSteps.length - 1) return
    const randomDelay = baseDuration + Math.floor(Math.random() * 800)
    const timeout = setTimeout(() => {
      setCurrent(prev => Math.min(prev + 1, loadingSteps.length - 1))
    }, randomDelay)
    return () => clearTimeout(timeout)
  }, [loading, current, loadingSteps.length, baseDuration])

  // Reset to step 0 when loading is done and overlay unmounts
  useEffect(() => {
    if (!loading && current !== 0) setCurrent(0)
  }, [loading])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoaderCore steps={loadingSteps} current={current} loading={loading} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
