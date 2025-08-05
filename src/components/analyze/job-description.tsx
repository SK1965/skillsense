'use client';

import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore } from '@/stores/resumeStore';

interface FormValues {
  resume: FileList;
  jd: string;
}

interface JobDescriptionSectionProps {
  form: UseFormReturn<FormValues>;
  disabled: boolean;
}

export default function JobDescriptionSection({
  form,
  disabled,
}: JobDescriptionSectionProps) {
  const { jd, setJD } = useResumeStore();

  // Hydrate form with stored values
  useEffect(() => {
    form.setValue('jd', jd || '');
  }, [jd, form]);

  return (
    <FormField
      control={form.control}
      name="jd"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            2. Paste Job Description
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Textarea
                placeholder="Paste the complete job description here..."
                className="min-h-[200px] max-h-[300px] resize-none rounded-2xl border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/60 backdrop-blur-md p-4 sm:p-6 text-sm sm:text-base transition-colors focus:border-blue-500 dark:focus:border-blue-400"
                {...field}
                onChange={(e) => {
                  setJD(e.target.value);
                  field.onChange(e);
                }}
                disabled={disabled}
              />
              {field.value?.trim() && (
                <CheckCircle2 className="absolute top-3 right-3 sm:top-4 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              )}
            </div>
          </FormControl>
          <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
            Include requirements, responsibilities, and preferred qualifications
            for best results.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
