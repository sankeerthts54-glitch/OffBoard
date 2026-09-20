import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Tag, Eye, Zap, CheckCircle } from 'lucide-react';

export default function AutomationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { icon: Search, label: 'Detect' },
    { icon: Tag, label: 'Classify' },
    { icon: Eye, label: 'Review' },
    { icon: Zap, label: 'Execute' },
    { icon: CheckCircle, label: 'Confirm' }
  ];

  return (
    <section className="py-24 relative" id="automation">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          From decision to action.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-400 text-lg mb-20"
        >
          Offboard doesn't just recommend — it executes.
        </motion.p>

        <div className="relative" ref={ref}>
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center relative group w-24 mb-12 md:mb-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.4 }}
                    className="glass-l3 w-16 h-16 rounded-full flex items-center justify-center text-indigo-400 glow-indigo shadow relative z-10"
                  >
                    <Icon size={24} />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.4 + 0.2 }}
                    className="text-xs text-indigo-400 mt-4 absolute top-16"
                  >
                    {step.label}
                  </motion.span>
                </div>
              );
            })}
          </div>

          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-gray-800 -z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={isInView ? { width: '100%' } : {}}
              transition={{ duration: 2, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
              style={{ backgroundSize: '200% auto', animation: 'gradient-move 2s linear infinite' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
