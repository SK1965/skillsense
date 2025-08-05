'use client';

import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useResumeStore } from '@/stores/resumeStore';

interface FormValues {
  resume: FileList;
  jd: string;
}

interface FileUploadSectionProps {
  form: UseFormReturn<FormValues>;
  disabled: boolean;
}

export default function FileUploadSection({
  form,
  disabled,
}: FileUploadSectionProps) {
  const { resume, setResume } = useResumeStore();
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hydrate form with stored values
  useEffect(() => {
    if (resume) {
      const dt = new DataTransfer();
      dt.items.add(resume);
      form.setValue('resume', dt.files, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setFileName(resume.name);
    }
  }, [resume, form]);

  // File validation
  const validateFile = (file: File): boolean => {
    setFileError(null);

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      setFileError('Please upload only PDF, DOC, or DOCX resume files');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('Resume file size must be less than 10MB');
      return false;
    }

    if (file.size < 1024) {
      setFileError('Resume file appears to be empty or corrupted');
      return false;
    }

    return true;
  };

  const triggerFileSelect = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <FormField
      control={form.control}
      name="resume"
      render={({ field }) => {
        const handleFileSelect = (file: File) => {
          if (validateFile(file)) {
            console.log('Valid file selected:', file.name);
            setFileName(file.name);
            setResume(file);
            setFileError(null);

            // Create FileList for the schema
            const dt = new DataTransfer();
            dt.items.add(file);

            field.onChange(dt.files);
            form.setValue('resume', dt.files, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });

            console.log('FileList set in form:', form.getValues('resume'));
          }
        };

        const handleFileRemove = () => {
          console.log('Removing file');
          setFileName(null);
          setResume(null);
          setFileError(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

          // Create empty FileList
          const dt = new DataTransfer();
          field.onChange(dt.files);
          form.setValue('resume', dt.files, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        };

        return (
          <FormItem>
            <FormLabel className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
              1. Upload Your Résumé
            </FormLabel>
            <FormControl>
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      console.log('File input changed:', selectedFile.name);
                      handleFileSelect(selectedFile);
                    }
                  }}
                  disabled={disabled}
                />

                <div
                  onClick={() => !disabled && triggerFileSelect()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!disabled) setDragOver(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!disabled) setDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(false);

                    if (disabled) return;

                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) {
                      console.log('File dropped:', droppedFile.name);
                      handleFileSelect(droppedFile);
                    }
                  }}
                  className={`
                    relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 sm:p-8 
                    transition-all duration-200 select-none
                    ${
                      dragOver
                        ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-900/30 scale-[1.02]'
                        : fileName
                          ? 'border-green-500 bg-green-50/40 dark:bg-green-900/30'
                          : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50/20 dark:hover:bg-blue-900/10'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {fileName ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center w-full"
                    >
                      <div className="mx-auto mb-3 grid h-12 w-12 sm:h-14 sm:w-14 place-content-center rounded-2xl bg-green-500/20">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      </div>
                      <p className="font-medium text-green-700 dark:text-green-400 text-sm sm:text-base break-all px-2">
                        {fileName}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFileRemove();
                        }}
                        disabled={disabled}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="h-3 w-3" />
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />
                      <div className="text-center">
                        <span className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
                          Click or drag to upload your résumé
                        </span>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                          PDF, DOC, DOCX only (Max 10MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <AnimatePresence>
                  {fileError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{fileError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FormControl>

            <FormDescription className="mt-2 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>
                We never save your résumé unless you choose to create an
                account.
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
