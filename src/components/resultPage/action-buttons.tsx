'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadPDF } from '@/lib/pdf-generator';
import { saveAnalysisToSupabase } from '@/lib/saveAnalysisToSupabase';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import z from 'zod';
import { ResultSchema } from '@/schemas/ResultSchema';

interface ActionButtonsProps {
  results: z.infer<typeof ResultSchema> | null;
  resume: File | null;
  jd: string | null;
  user: User | null;
}

export default function ActionButtons({
  results,
  resume,
  jd,
  user,
}: ActionButtonsProps) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);

  // Check if report is already saved for logged-in users
  useEffect(() => {
    if (user && results) {
      const wasAnalyzedWhileLoggedIn =
        sessionStorage.getItem('analyzedWithUser');
      setIsAlreadySaved(!!wasAnalyzedWhileLoggedIn);
    }
  }, [user, results]);

  const handleDownloadPDF = async () => {
    if (!results) return;
    setIsDownloading(true);
    try {
      await downloadPDF(results);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Use useCallback to memoize the function and fix the ESLint warning
  const handleSaveReport = useCallback(async () => {
    if (!user) {
      sessionStorage.setItem('pendingSave', 'true');
      router.push('/auth?redirect=save-report');
      return;
    }

    if (!results || !resume || !jd) {
      toast.error('Missing data to save report');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving to Supabase:', {
        userId: user.id,
        jd: jd.substring(0, 50) + '...',
        fileName: resume.name,
      });

      await saveAnalysisToSupabase({
        jd,
        file: resume,
        result: results,
        userId: user.id,
      });

      setIsAlreadySaved(true);
      sessionStorage.setItem('analyzedWithUser', 'true');
      toast.success('Report saved to your profile!');

      console.log('Successfully saved to Supabase');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save report. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [user, results, resume, jd, router]);

  // Handle pending save after auth - now with proper dependencies
  useEffect(() => {
    const pendingSave = sessionStorage.getItem('pendingSave');
    if (pendingSave && user && results && !isAlreadySaved) {
      sessionStorage.removeItem('pendingSave');
      handleSaveReport();
    }
  }, [user, results, isAlreadySaved, handleSaveReport]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.14 }}
      aria-label="Action Buttons"
      className="mt-6 mb-8 sm:mb-10 pt-6 border-t border-neutral-300 dark:border-neutral-700 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
    >
      <Button
        size="lg"
        variant="default"
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className="inline-flex items-center gap-2"
        aria-label="Download Resume Analysis as PDF"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
        {isDownloading ? 'Generating PDF...' : 'Download PDF'}
      </Button>

      {/* Save button - only show if not already saved */}
      {!isAlreadySaved && (
        <Button
          size="lg"
          variant="outline"
          onClick={handleSaveReport}
          disabled={isSaving}
          className="inline-flex items-center gap-2"
          aria-label="Save report to profile"
        >
          <Save className="h-5 w-5" />
          {isSaving ? 'Saving...' : user ? 'Save Report' : 'Login to Save'}
        </Button>
      )}

      <Button
        size="lg"
        variant="secondary"
        className="inline-flex items-center gap-2"
        aria-label="Analyze another Resume and Job Description"
        onClick={() => router.push('/')}
      >
        <ArrowPathIcon className="h-5 w-5" /> Analyze Another
      </Button>
    </motion.section>
  );
}
