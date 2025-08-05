'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Calendar,
  Target,
} from 'lucide-react';
import type { History } from '@/types/history';

export function AnalysisCard({ item }: { item: History }) {
  const [open, setOpen] = useState(false);

  const matchedCount = item.skills_matched?.length || 0;
  const missingCount = item.skills_missing?.length || 0;

  return (
    <div className="group bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Header */}
      <div className="p-6 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                  {item.resume_name || 'Resume'}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Score:{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.match_score}%
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Summary */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {matchedCount} Matched
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {missingCount} Missing
              </span>
              <a
                href={item.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View Resume
              </a>
            </div>
          </div>

          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
            {open ? (
              <ChevronUp className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {open && (
        <div className="px-6 pb-6 space-y-6 border-t border-slate-200/50 dark:border-slate-600/50 pt-6">
          {/* Job Description */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Job Description
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 max-h-32 overflow-y-auto custom-scrollbar">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.job_title || 'No job description provided'}
              </p>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div>
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Matched Skills ({matchedCount})
              </h4>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 max-h-32 overflow-y-auto custom-scrollbar">
                {matchedCount > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.skills_matched?.slice(0, 10).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {matchedCount > 10 && (
                      <span className="inline-block px-2 py-1 bg-green-300 dark:bg-green-700/50 text-green-800 dark:text-green-300 text-xs rounded-md">
                        +{matchedCount - 10} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    No matched skills found
                  </p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Missing Skills ({missingCount})
              </h4>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 max-h-32 overflow-y-auto custom-scrollbar">
                {missingCount > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.skills_missing?.slice(0, 10).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-300 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {missingCount > 10 && (
                      <span className="inline-block px-2 py-1 bg-red-300 dark:bg-red-700/50 text-red-800 dark:text-red-300 text-xs rounded-md">
                        +{missingCount - 10} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    No missing skills identified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              AI Suggestions
            </h4>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 max-h-32 overflow-y-auto custom-scrollbar">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.ai_suggestions || 'No suggestions provided'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
