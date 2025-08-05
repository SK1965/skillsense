'use client';

import { TrendingUp, FileText, Clock } from 'lucide-react';
import type { History } from '@/types/history';

interface StatsGridProps {
  history: History[];
}

export default function StatsGrid({ history }: StatsGridProps) {
  const avgScore =
    history.length > 0
      ? Math.round(
          history.reduce((sum, item) => sum + item.match_score, 0) /
            history.length,
        )
      : 0;

  const latestDate =
    history.length > 0
      ? new Date(history[0].created_at).toLocaleDateString()
      : 'N/A';

  const stats = [
    {
      value: history.length,
      label: 'Total Analyses',
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      value: `${avgScore}%`,
      label: 'Average Score',
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      value: latestDate,
      label: 'Latest Analysis',
      icon: Clock,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/50"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 ${stat.bgColor} rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
