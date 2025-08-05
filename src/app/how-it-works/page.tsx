'use client';

import Navbar from '@/components/navbar';
import { steps } from '@/data/appData';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <section className="relative pb-32 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 overflow-hidden min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text">
            How SkillSense Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 px-2">
            Simple, transparent, and built for you: our workflow ensures you
            always know what’s next.
          </p>
        </motion.div>

        {/* Vertical timeline line for md and up */}
        <div className="hidden md:block absolute inset-y-0 left-1/2 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400 opacity-40 rounded-full z-0" />

        {/* Steps Container */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Mobile: vertical list */}
          <div className="flex flex-col space-y-12 md:hidden">
            {steps.map(
              (
                { icon: Icon, title, description, highlight, gradient },
                idx,
              ) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-lg border border-white/20 dark:border-neutral-700"
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center bg-gradient-to-tr ${gradient} shadow-lg mb-5 mx-auto`}
                  >
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 text-center">
                    {title}
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 sm:text-base leading-relaxed text-center">
                    {description}
                  </p>
                  <p className="italic text-purple-600 dark:text-purple-400 text-sm sm:text-base text-center mt-2">
                    {highlight}
                  </p>
                </motion.div>
              ),
            )}
          </div>

          {/* Desktop & tablet: staggered timeline */}
          <ol className="hidden md:block relative space-y-24">
            {steps.map(
              (
                { icon: Icon, title, description, highlight, gradient },
                idx,
              ) => {
                const isLeft = idx % 2 === 0;
                return (
                  <motion.li
                    key={title}
                    initial={{
                      opacity: 0,
                      x: isLeft ? -60 : 60,
                      scale: 0.95,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                    }}
                    transition={{ duration: 0.7, delay: idx * 0.12 }}
                    viewport={{ once: true }}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isLeft ? '' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`w-full md:w-1/2 flex flex-col items-center md:items-${
                        isLeft ? 'end' : 'start'
                      }`}
                    >
                      <div
                        className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-tr ${gradient} shadow-xl`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Timeline node joint (center control) */}
                    <span
                      className={`z-10 mx-10 w-7 h-7 rounded-full ring-4 ring-white dark:ring-neutral-900 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                    >
                      <span className="block w-3 h-3 bg-white dark:bg-neutral-900 rounded-full" />
                    </span>

                    <div
                      className={`w-full md:w-1/2 mt-8 md:mt-0 flex flex-col gap-5 items-center md:items-${
                        isLeft ? 'start' : 'end'
                      }`}
                    >
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        {title}
                      </h3>
                      <p className="text-neutral-700 dark:text-neutral-300">
                        {description}
                      </p>
                      <span className="italic text-sm text-purple-600 dark:text-purple-400">
                        {highlight}
                      </span>
                    </div>
                  </motion.li>
                );
              },
            )}
          </ol>
        </div>
      </div>

      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-72 h-72 sm:w-96 sm:h-96 bg-purple-600 opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-72 h-72 sm:w-96 sm:h-96 bg-pink-600 opacity-20 rounded-full blur-3xl animate-pulse animation-delay-4000" />
    </section>
  );
}
