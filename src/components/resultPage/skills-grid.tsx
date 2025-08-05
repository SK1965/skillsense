'use client';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Tooltip from '@/components/ui/tooltip';

interface SkillsGridProps {
  skillsMatched: string[];
  missingSkills: string[];
}

export default function SkillsGrid({
  skillsMatched,
  missingSkills,
}: SkillsGridProps) {
  return (
    <section className="grid gap-6 sm:gap-10 md:grid-cols-2">
      {/* Skills Present */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border bg-green-50/80 dark:bg-green-900/20 p-6 sm:p-8 shadow-lg"
      >
        <h3 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-green-700 dark:text-green-300 mb-4">
          <CheckCircleIcon className="h-6 w-6 text-green-500" /> Skills Detected
        </h3>
        <ul
          aria-label="Skills found in resume"
          className="flex flex-wrap gap-3"
        >
          {skillsMatched.map((skill) => (
            <li key={skill}>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs sm:text-sm font-medium shadow whitespace-nowrap">
                {skill}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Skills Missing */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border bg-red-50/80 dark:bg-red-900/20 p-6 sm:p-8 shadow-lg"
      >
        <h3 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-red-700 dark:text-red-300 mb-4">
          <XCircleIcon className="h-6 w-6 text-red-500" /> Skills Missing
        </h3>
        {missingSkills.length > 0 ? (
          <ul
            aria-label="Skills missing from resume"
            className="flex flex-wrap gap-3"
          >
            {missingSkills.map((skill) => (
              <li key={skill}>
                <Tooltip content={`Tip: Add '${skill}' to boost your fit!`}>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium shadow whitespace-nowrap cursor-help">
                    {skill}
                  </span>
                </Tooltip>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600 font-semibold">
            No critical skills missing 🎉
          </p>
        )}
      </motion.div>
    </section>
  );
}
