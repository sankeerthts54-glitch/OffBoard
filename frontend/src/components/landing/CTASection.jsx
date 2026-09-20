import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function CTASection({ onStart }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 relative overflow-hidden" ref={ref}>
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] -z-10" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px] -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          <span className="text-white block mb-2">Whatever changes next,</span>
          <span className="text-gradient-animated block">your digital life is ready.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto"
        >
          Tell Offboard what's changing. We'll handle the digital aftermath.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <button 
            onClick={onStart}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xl px-10 py-5 rounded-2xl cta-glow gradient-border transition-all duration-300 relative z-10"
          >
            Start Offboarding →
          </button>
          <p className="text-xs text-gray-600">
            Free during beta · No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
