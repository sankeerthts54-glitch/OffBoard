import React from 'react';
import { motion } from 'framer-motion';
import HeroVisual from './HeroVisual';

export default function HeroSection({ onStart }) {
  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0 }}
        className="glass-l1 rounded-full px-4 py-1.5 flex items-center gap-2 mb-8 border border-white/10"
      >
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
        <span className="text-xs font-semibold tracking-wider text-indigo-300">
          AI-POWERED DIGITAL LIFE MANAGEMENT
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="mb-6 flex flex-col gap-2"
      >
        <span className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
          Your life is changing.
        </span>
        <span className="text-5xl md:text-7xl font-extrabold tracking-tight text-gradient-animated">
          Your digital life should too.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Offboard turns life's biggest transitions into a simple digital checklist — powered by AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 mb-12"
      >
        <button
          onClick={onStart}
          className="cta-glow gradient-border bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 py-4 text-lg font-semibold transition-all flex items-center gap-2 group relative overflow-hidden"
        >
          <span className="relative z-10">Start Offboarding &rarr;</span>
        </button>
        
        <button
          onClick={scrollToHowItWorks}
          className="glass-l1 border border-white/10 hover:bg-white/5 text-white rounded-xl px-8 py-4 text-lg font-medium transition-all"
        >
          See How It Works
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-xs text-gray-600 tracking-wide font-medium"
      >
        ✦ Built on AWS · Powered by Amazon Bedrock · 100% Serverless
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        className="w-full mt-16"
      >
        <HeroVisual />
      </motion.div>
    </section>
  );
}
