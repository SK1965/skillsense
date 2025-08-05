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
import { MultiStepLoader } from '@/components/ui/multi-step-loader';
import { useResumeStore } from '@/stores/resumeStore';
import { useAuth } from '@/context/AuthContext';
import { saveAnalysisToSupabase } from '@/lib/saveAnalysisToSupabase';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

type Fields = z.infer<typeof JDSchema>;
const stepsText = [
  { text: 'Uploading résumé…' },
  { text: 'Reading content…' },
  { text: 'Analyzing JD…' },
  { text: 'Matching skills…' },
  { text: 'Generating tips…' },
  { text: 'Almost done…' },
];

export default function ResumeJDForm() {
  const form = useForm<Fields>({ resolver: zodResolver(JDSchema) });
  const router = useRouter();
  const { user } = useAuth();
  const { resume, jd, setResume, setJD } = useResumeStore();

  /* state */
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  /* hydrate */
  useEffect(() => {
    form.setValue('jd', jd || '');
    if (resume) {
      form.setValue('resume', [resume]);
      setFileName(resume.name);
    }
  }, [jd, resume, form]);

  /* submit ------------------------------------------------------------- */
  const onSubmit = async (vals: Fields) => {
    setBusy(true);

    const fd = new FormData();
    if (vals.resume?.[0]) fd.append('resume', vals.resume[0]);
    if (vals.jd) fd.append('jd', vals.jd);

    try {
      const { data } = await axios.post('/api/analyze', fd);
      sessionStorage.setItem('analysisResult', JSON.stringify(data));
      if (vals.resume?.[0]) setResume(vals.resume[0]);
      setJD(vals.jd);

      if (vals.resume?.[0] && user?.id) {
        await saveAnalysisToSupabase({
          jd: vals.jd,
          file: vals.resume[0],
          result: data,
          userId: user.id,
        });
      }
      router.push('/score');
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  if (busy) return <MultiStepLoader loadingSteps={stepsText} loading />;

  /* helpers */
  const handleFile = (file: File) => {
    setFileName(file.name);
    setResume(file);
    form.setValue('resume', [file]);
  };

  return (
    <div className="rounded-3xl border border-white/20 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-2xl overflow-hidden">
      {/* top progress bar */}
      <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600" />

      <div className="px-8 py-10 sm:px-10">
        {/* hero badge */}
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600">
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-center text-3xl md:text-4xl font-bold mb-10 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Get Your Match Score
        </h2>

        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* upload -------------------------------------------------- */}
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    1. Upload Résumé
                  </FormLabel>
                  <FormControl>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        if (e.dataTransfer.files?.[0]) {
                          handleFile(e.dataTransfer.files[0]);
                          field.onChange(e.dataTransfer.files);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition
            ${dragOver ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-900/30' : 'border-slate-300 dark:border-slate-600'}
          `}
                    >
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFile(file);
                            field.onChange(e.target.files);
                          }
                        }}
                        id="resume-upload"
                      />

                      {fileName ? (
                        /* When file is selected */
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center"
                        >
                          <div className="mx-auto mb-4 grid h-14 w-14 place-content-center rounded-2xl bg-green-500/20">
                            <FileText className="h-6 w-6 text-green-600" />
                          </div>
                          <p className="font-medium text-green-700 dark:text-green-400">
                            {fileName}
                          </p>
                        </motion.div>
                      ) : (
                        /* When no file */
                        <>
                          <Upload className="h-10 w-10 text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Click or drag to upload PDF/DOC/DOCX
                          </span>
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <AlertCircle className="h-4 w-4" />
                    We never save your résumé unless you choose to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* JD ------------------------------------------------------- */}
            <FormField
              control={form.control}
              name="jd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    2. Paste Job Description
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        rows={10}
                        placeholder="Paste the full job description here…"
                        className="min-h-[10rem] resize-none rounded-2xl border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/60 backdrop-blur-md p-6 text-sm"
                        {...field}
                        onChange={(e) => {
                          setJD(e.target.value);
                          field.onChange(e);
                        }}
                      />
                      {field.value?.trim() && (
                        <CheckCircle2 className="absolute top-4 right-4 h-6 w-6 text-green-500" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CTA ------------------------------------------------------ */}
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block"
              >
                <Button
                  type="submit"
                  disabled={!fileName || !form.watch('jd')?.trim()}
                  className="gap-3 rounded-2xl px-10 py-4 text-lg"
                >
                  <Zap className="h-5 w-5" />
                  Analyze&nbsp;Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
              {!fileName || !form.watch('jd')?.trim() ? (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Upload a résumé and paste a JD to enable the button.
                </p>
              ) : null}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
