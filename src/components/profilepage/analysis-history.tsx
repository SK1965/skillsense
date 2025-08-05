'use client';

import { Loader2, FileText } from 'lucide-react';
import { AnalysisCard } from '@/components/analysis-card';
import type { History } from '@/types/history';

interface AnalysisHistoryProps {
  history: History[];
  loading: boolean;
}

export default function AnalysisHistory({
  history,
  loading,
}: AnalysisHistoryProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Analysis History
        </h2>
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400">
          {history.length} {history.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {loading ? (
        <LoadingSection />
      ) : history.length === 0 ? (
        <EmptyState />
      ) : (
        <HistoryList history={history} />
      )}
    </div>
  );
}

function LoadingSection() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-slate-600 dark:text-slate-400">
          Loading your analyses...
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-2">
        No analyses found yet
      </p>
      <p className="text-slate-500 dark:text-slate-500 text-sm">
        Upload your first resume to get started
      </p>
    </div>
  );
}

function HistoryList({ history }: { history: History[] }) {
  return (
    <>
      <div className="space-y-4  overflow-y-auto pr-2 custom-scrollbar">
        {history.map((item) => (
          <AnalysisCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
