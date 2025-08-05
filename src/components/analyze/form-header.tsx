'use client';

import { Sparkles } from 'lucide-react';

export default function FormHeader() {
  return (
    <>
      {/* Hero badge */}
      <div className="mx-auto mb-6 sm:mb-8 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600">
        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      </div>

      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
        Get Your Match Score
      </h2>
    </>
  );
}
