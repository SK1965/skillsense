'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { StarIcon } from 'lucide-react';
// --- These new imports are key: ---
import confetti from 'canvas-confetti';
import Tooltip from '@/components/ui/tooltip'; // Create this or swap for your lib's tooltip

import CircularScore from '@/components/resultPage/circular-score'; // Animations are handled here!
import { ResultSchema } from '@/schemas/ResultSchema';
import z from 'zod';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<z.infer<typeof ResultSchema>>();
  const [score, setScore] = useState(0);
  const confettiFired = useRef(false);

  // On mount, load and validate results
  useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult');
    if (storedResult) {
      try {
        const parsedData = JSON.parse(storedResult);
        const validation = ResultSchema.safeParse(parsedData);
        if (validation.success) {
          setResults(validation.data);
        } else {
          console.error('Validation error:', validation.error);
          router.push('/');
        }
      } catch (error) {
        console.error('Parse error:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  // Animate score counting up for drama
  useEffect(() => {
    if (!results) return;
    let num = 0;
    const target = results.matchScore;
    const increment = Math.ceil(target / 30); // Smooth 1s count-up
    const id = setInterval(() => {
      num = Math.min(num + increment, target);
      setScore(num);
      if (num >= target) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [results]);

  // Confetti when excellent
  useEffect(() => {
    if (results && results.matchScore >= 80 && !confettiFired.current) {
      confettiFired.current = true;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.4 } });
    }
    if (results && results.matchScore < 80) {
      confettiFired.current = false; // allow refire on rerun
    }
  }, [results]);

  if (!results)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50/60 via-white to-green-50/60 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-12 sm:px-8 text-neutral-900 dark:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-br from-blue-600 to-green-500 inline-block  bg-clip-text">
            🎯
          </h1>
          <h1 className="text-5xl font-extrabold bg-gradient-to-br from-blue-600 to-green-500 inline-block text-transparent bg-clip-text">
            Resume Fit Score
          </h1>
          <p className="mt-2 text-md text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            Instantly see how well your resume matches this job, what makes you
            stand out, and what to improve for maximum impact.
          </p>
        </motion.div>

        {/* Score Block with count-up animation */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <p className="text-lg mb-4 text-neutral-700 dark:text-neutral-200">
            Your resume&apos;s job match:
          </p>
          <CircularScore score={score} /> {/* Animated! */}
          <AnimatePresence>
            {results.matchScore < 80 ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-sm text-amber-600 dark:text-yellow-400 font-bold"
              >
                Good! But you can still improve your fit.
              </motion.p>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-green-600 dark:text-green-300 font-bold"
              >
                Excellent fit!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Skill Comparison */}
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Skills Present */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-2xl border bg-green-50 dark:bg-green-900/10 p-8 shadow-lg"
          >
            <h3 className="flex items-center gap-2 text-xl font-bold text-green-700 dark:text-green-300 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden />{' '}
              Skills Detected
            </h3>
            <ul
              aria-label="Skills found in resume"
              className="flex flex-wrap gap-3 list-none p-0 m-0"
            >
              {results.skillsMatched.map((skill) => (
                <li key={skill}>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium shadow whitespace-nowrap">
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Skills Missing with enhanced tooltips! */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.33 }}
            className="rounded-2xl border bg-red-50 dark:bg-red-900/10 p-8 shadow-lg"
          >
            <h3 className="flex items-center gap-2 text-xl font-bold text-red-700 dark:text-red-300 mb-4">
              <XCircleIcon className="h-6 w-6 text-red-500" aria-hidden />{' '}
              Skills Missing
            </h3>
            {results.missingSkills.length > 0 ? (
              <ul
                aria-label="Skills missing from resume"
                className="flex flex-wrap gap-3 list-none p-0 m-0"
              >
                {results.missingSkills.map((skill) => (
                  <li key={skill}>
                    {/* EXAMPLE: Add tooltip for each missing skill */}
                    <Tooltip content={`Tip: Add '${skill}' to boost your fit!`}>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium shadow whitespace-nowrap cursor-help">
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
        </div>

        {/* AI Suggestions */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-2xl border p-8 bg-blue-50/70 dark:bg-blue-900/10 shadow-lg"
        >
          <h3 className="flex items-center gap-2 text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">
            <LightBulbIcon className="h-6 w-6 text-blue-500" aria-hidden /> AI
            Recommendations
          </h3>
          <ul
            className="space-y-3 pl-4 list-disc"
            aria-label="AI suggestions to improve resume"
          >
            {results.suggestions.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <LightBulbIcon
                  className="h-5 w-5 text-blue-400 mt-1"
                  aria-hidden
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Stand-Out Suggestions */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-2xl border p-8 bg-yellow-50/70 dark:bg-yellow-900/10 shadow-lg"
        >
          <h3 className="flex items-center gap-2 text-xl font-bold text-amber-700 dark:text-yellow-300 mb-4">
            <StarIcon className="h-6 w-6 text-amber-500" aria-hidden /> Make
            Your Resume Stand Out
          </h3>
          <ul
            className="space-y-3 pl-4 list-disc"
            aria-label="Extra suggestions to make resume stand out"
          >
            {results.extraEdgeSuggestions.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <StarIcon className="h-5 w-5 text-amber-400 mt-1" aria-hidden />
                <div>
                  <strong>{tip.title}:</strong> {tip.description}
                </div>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Action Buttons */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          aria-label="Action Buttons"
          className="mt-12 pt-6 border-t border-neutral-300 dark:border-neutral-700 flex justify-center gap-6"
        >
          <Button
            size="lg"
            variant="default"
            className="inline-flex items-center gap-2"
            aria-label="Download Resume Analysis as PDF"
          >
            <ArrowDownTrayIcon className="h-5 w-5" aria-hidden /> Download PDF
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="inline-flex items-center gap-2"
            aria-label="Analyze another Resume and Job Description"
            // Optionally add onClick={() => router.push("/")} or your handler
          >
            <ArrowPathIcon className="h-5 w-5" aria-hidden /> Analyze Another
          </Button>
        </motion.section>
      </div>
    </div>
  );
}
