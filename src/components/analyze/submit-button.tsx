'use client';

import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormValues {
  resume: FileList;
  jd: string;
}

interface SubmitButtonProps {
  form: UseFormReturn<FormValues>;
  disabled: boolean;
}

export default function SubmitButton({ form, disabled }: SubmitButtonProps) {
  const resumeFiles = form.watch('resume');
  const jdValue = form.watch('jd');

  const hasResume = resumeFiles && resumeFiles.length === 1;
  const hasJD = jdValue && jdValue.trim().length >= 10;

  const isFormValid = hasResume && hasJD && form.formState.isValid;

  return (
    <div className="text-center pt-4">
      <motion.div
        whileHover={{ scale: isFormValid ? 1.02 : 1 }}
        whileTap={{ scale: isFormValid ? 0.98 : 1 }}
        className="inline-block w-full sm:w-auto"
      >
        <Button
          type="submit"
          disabled={!isFormValid || disabled}
          className="w-full sm:w-auto gap-2 sm:gap-3 rounded-2xl px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Zap className="h-4 w-4 sm:h-5" />
          Analyze Now
          <ArrowRight className="h-4 w-4  sm:h-5" />
        </Button>
      </motion.div>

      {!isFormValid && (
        <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {!hasResume && 'Please upload your résumé. '}
          {!hasJD && 'Please enter at least 10 characters in job description. '}
        </p>
      )}
    </div>
  );
}
