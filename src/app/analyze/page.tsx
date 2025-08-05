'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JDSchema } from '@/schemas/JDSchema';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';
import { useResumeStore } from '@/stores/resumeStore';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { saveAnalysisToSupabase } from '@/lib/saveAnalysisToSupabase';
import { useRouter } from 'next/navigation';
import FormHeader from '@/components/analyze/form-header';
import FileUploadSection from '@/components/analyze/file-upload-section';
import JobDescriptionSection from '@/components/analyze/job-description';
import SubmitButton from '@/components/analyze/submit-button';

type Fields = z.infer<typeof JDSchema>;

const stepsText = [
  { text: 'Uploading résumé…' },
  { text: 'Reading content…' },
  { text: 'Analyzing JD…' },
  { text: 'Matching skills…' },
  { text: 'Generating tips…' },
  { text: 'Almost done…' },
];

export default function AnalyzePage() {
  const form = useForm<Fields>({
    resolver: zodResolver(JDSchema),
    mode: 'onChange',
  });
  const router = useRouter();
  const { user } = useAuth();
  const { setResume, setJD } = useResumeStore();
  const [busy, setBusy] = useState(false);

  const onSubmit = async (vals: Fields) => {
    console.log('Form submission values:', vals);
    console.log('Resume FileList:', vals.resume);
    console.log('FileList length:', vals.resume?.length);
    console.log('First file:', vals.resume?.[0]);

    const resumeFile = vals.resume?.[0];
    if (!resumeFile) {
      console.error('No resume file provided');
      form.setError('resume', { message: 'Resume file is required' });
      return;
    }

    setBusy(true);
    const fd = new FormData();
    fd.append('resume', resumeFile);
    fd.append('jd', vals.jd);

    try {
      const { data } = await axios.post('/api/v1/analyze', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      sessionStorage.setItem('analysisResult', JSON.stringify(data));

      setResume(resumeFile);
      setJD(vals.jd);

      if (resumeFile && user?.id) {
        await saveAnalysisToSupabase({
          jd: vals.jd,
          file: resumeFile,
          result: data,
          userId: user.id,
        });
        sessionStorage.setItem('analyzedWithUser', 'true');
      }

      router.push('/score');
    } catch (err) {
      console.error('Analysis failed:', err);
      form.setError('root', {
        message: 'Analysis failed. Please try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  if (busy) return <MultiStepLoader loadingSteps={stepsText} loading />;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-3xl border border-white/20 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          <FormHeader />

          {/* Root error display */}
          {form.formState.errors.root && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">
                {form.formState.errors.root.message}
              </p>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 sm:space-y-12"
            >
              <FileUploadSection form={form} disabled={busy} />
              <JobDescriptionSection form={form} disabled={busy} />
              <SubmitButton form={form} disabled={busy} />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
