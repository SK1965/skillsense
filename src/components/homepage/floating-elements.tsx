'use client';

import { motion, MotionValue } from 'framer-motion';

interface FloatingElementsProps {
  y1: MotionValue<number>;
  y2: MotionValue<number>;
}

export default function FloatingElements({ y1, y2 }: FloatingElementsProps) {
  return (
    <>
      <motion.div
        style={{ y: y1 }}
        className="absolute top-16 left-4 w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-15 blur-md"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 right-8 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-15 blur-md"
      />
    </>
  );
}
