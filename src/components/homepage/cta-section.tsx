'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, Rocket, ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join 50,000+ professionals who transformed their careers with
              AI-powered resume analysis
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <Rocket className="w-6 h-6" />
              Start Free Analysis
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
