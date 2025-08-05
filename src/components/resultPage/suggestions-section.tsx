'use client';
import { motion } from 'framer-motion';
import { LightBulbIcon } from '@heroicons/react/24/solid';
import { StarIcon } from 'lucide-react';

interface SuggestionsSectionProps {
  suggestions: string[] | Array<{ title: string; description: string }>;
  variant?: 'recommendations' | 'standout';
}

export default function SuggestionsSection({
  suggestions,
  variant = 'recommendations',
}: SuggestionsSectionProps) {
  const isStandout = variant === 'standout';

  if (suggestions.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: isStandout ? 0.1 : 0 }}
      className={`rounded-2xl border p-6 sm:p-8 shadow-lg ${
        isStandout
          ? 'bg-yellow-50/80 dark:bg-yellow-900/20'
          : 'bg-blue-50/80 dark:bg-blue-900/20'
      }`}
    >
      <h3
        className={`flex items-center gap-2 text-lg sm:text-xl font-bold mb-4 ${
          isStandout
            ? 'text-amber-700 dark:text-yellow-300'
            : 'text-blue-700 dark:text-blue-300'
        }`}
      >
        {isStandout ? (
          <StarIcon className="h-6 w-6 text-amber-500" />
        ) : (
          <LightBulbIcon className="h-6 w-6 text-blue-500" />
        )}
        {isStandout ? 'Make Your Resume Stand Out' : 'AI Recommendations'}
      </h3>

      <ul className="space-y-3 list-disc pl-4">
        {suggestions.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            {isStandout ? (
              <StarIcon className="h-5 w-5 text-amber-400 mt-1 hidden sm:block" />
            ) : (
              <LightBulbIcon className="h-5 w-5 text-blue-400 mt-1 hidden sm:block" />
            )}
            <div>
              {typeof item === 'string' ? (
                <span>{item}</span>
              ) : (
                <>
                  <span className="font-semibold">{item.title}:</span>{' '}
                  {item.description}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
