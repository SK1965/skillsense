'use client';

import { motion } from 'framer-motion';
import { LucideUpload, LucideSettings, LucideRocket } from 'lucide-react';

const steps = [
  {
    icon: <LucideUpload size={28} />,
    title: 'Upload Resume',
    description: 'Drag-and-drop your PDF or DOCX. Our AI ingests it instantly.',
  },
  {
    icon: <LucideSettings size={28} />,
    title: 'AI Skill Analysis',
    description: 'We compare your skills with the JD and surface gaps.',
  },
  {
    icon: <LucideRocket size={28} />,
    title: 'Tailored Suggestions',
    description:
      'Get concrete edits & skill recommendations to lift your score.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          How SkillSense Works
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400">
          Three simple steps to unlock your resume’s potential
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/20 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/70 backdrop-blur-lg p-8 shadow-md"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
