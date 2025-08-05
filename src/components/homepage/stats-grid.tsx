'use client';

import { motion } from 'framer-motion';
import { stats } from '@/data/appData';

export default function StatsGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 shadow-lg"
        >
          <div className="text-blue-600 dark:text-blue-400 mb-2 flex justify-center">
            <stat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {stat.value}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
