'use client';

import { motion } from 'framer-motion';
import { LucideUpload, LucideSettings, LucideRocket } from 'lucide-react';

const steps = [
  {
    icon: <LucideUpload size={32} />,
    title: 'Upload Resume',
    description:
      'Start by uploading your resume in PDF format. Our AI will process it instantly.',
  },
  {
    icon: <LucideSettings size={32} />,
    title: 'AI Skill Analysis',
    description:
      'Our engine compares your skills with top job descriptions and highlights gaps.',
  },
  {
    icon: <LucideRocket size={32} />,
    title: 'Get Tailored Suggestions',
    description:
      'Receive suggestions to improve your resume, including skill recommendations and rewriting tips.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white dark:bg-neutral-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          How SkillSense Works
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-base text-gray-600 dark:text-gray-400">
          Just 3 simple steps to unlock your resume’s potential.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="flex flex-col items-center p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-md dark:bg-neutral-900 bg-white"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
