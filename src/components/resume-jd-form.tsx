'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JDSchema } from '@/schemas/JDSchema';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';
import { useResumeStore } from '@/stores/resumeStore';
import { useAuth } from '@/context/AuthContext';
import { saveAnalysisToSupabase } from '@/lib/saveAnalysisToSupabase';

// Inferred form type
type ResumeJDFormValues = z.infer<typeof JDSchema>;

const loadingSteps = [
  { text: 'Uploading your resume...' },
  { text: 'Reading resume content...' },
  { text: 'Analyzing job description...' },
  { text: 'Matching skills and experience...' },
  { text: 'Generating smart suggestions...' },
  { text: 'Finalizing report...' },
];

export default function ResumeJDForm() {
  const form = useForm<ResumeJDFormValues>({
    resolver: zodResolver(JDSchema),
  });

  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const { resume, jd, setResume, setJD } = useResumeStore();
  const [fileName, setFileName] = useState<string | null>(
    resume ? resume.name : null,
  );
  const { user } = useAuth();

  useEffect(() => {
    form.setValue('jd', jd || '');
    if (resume) form.setValue('resume', [resume]);
  }, [jd, resume, form]);

  const onSubmit = async (values: ResumeJDFormValues) => {
    setLoader(true);
    const formData = new FormData();
    if (values.resume?.[0]) formData.append('resume', values.resume[0]);
    if (values.jd) formData.append('jd', values.jd);

    try {
      const response = await axios.post('/api/analyze', formData);
      sessionStorage.setItem('analysisResult', JSON.stringify(response.data));
      if (values.resume?.[0]) setResume(values.resume[0]);
      setJD(values.jd);

      // If user is signed in, save the analysis to Supabase
      if (values.resume?.[0] && user?.id) {
        await saveAnalysisToSupabase({
          jd,
          file: values.resume[0],
          result: response.data,
          userId: user.id,
        });
      }
      router.push('/score');
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  if (loader)
    return <MultiStepLoader loadingSteps={loadingSteps} loading={loader} />;

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 sm:px-6 md:px-8 py-6 sm:py-8 shadow-xl">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center text-black dark:text-white">
        Resume & Job Description Analyzer
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          {/* File Upload */}
          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">
                  Upload Resume
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <label
                      htmlFor="resume-upload"
                      className="group flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 sm:p-6 cursor-pointer hover:border-blue-500 transition-all text-center bg-neutral-50 dark:bg-neutral-900 hover:bg-blue-50/20"
                    >
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 group-hover:text-blue-500 transition"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 15.75V19a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 19v-3.25M7.5 10.5L12 6m0 0l4.5 4.5M12 6v12"
                        />
                      </svg>

                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-600">
                        Tap to upload or drag your resume here
                      </span>

                      {fileName && (
                        <p className="text-sm mt-1 text-green-600 dark:text-green-400 font-medium">
                          Selected: {fileName}
                        </p>
                      )}
                    </label>

                    <Input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileName(file.name);
                          setResume(file);
                          field.onChange(e.target.files);
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground mt-1">
                  Accepted formats: PDF, DOC, DOCX
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* JD Textarea */}
          <FormField
            control={form.control}
            name="jd"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">
                  Paste Job Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={8}
                    className="resize-none min-h-[10rem] text-sm"
                    placeholder="Enter the job description here..."
                    {...field}
                    onChange={(e) => {
                      setJD(e.target.value);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Used to match your resume with this JD
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="px-6 py-2 text-sm sm:text-base font-medium"
            >
              Analyze with AI
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
