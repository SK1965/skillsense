'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 md:mb-2 sm:mb-8 border border-white/20 dark:border-slate-700/50 shadow-lg"
    >
      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
        Trusted by 1000+ professionals
      </span>
      <div className="flex -space-x-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white"
          ></div>
        ))}
      </div>
    </motion.div>
  );
}
