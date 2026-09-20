import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe2, Briefcase, HeartCrack, Palmtree, Users, Trash2 } from 'lucide-react';

export default function WhatIsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const transitions = [
    { icon: Globe2, label: 'Moving Abroad', color: 'text-blue-400', hoverBorder: 'hover:border-blue-400/50', glow: 'hover:shadow-[0_0_15px_rgba(96,165,250,0.3)]' },
    { icon: Briefcase, label: 'New Job', color: 'text-indigo-400', hoverBorder: 'hover:border-indigo-400/50', glow: 'hover:shadow-[0_0_15px_rgba(129,140,248,0.3)]' },
    { icon: HeartCrack, label: 'Breakup', color: 'text-rose-400', hoverBorder: 'hover:border-rose-400/50', glow: 'hover:shadow-[0_0_15px_rgba(251,113,133,0.3)]' },
    { icon: Palmtree, label: 'Retirement', color: 'text-amber-400', hoverBorder: 'hover:border-amber-400/50', glow: 'hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
    { icon: Users, label: 'Family Affairs', color: 'text-teal-400', hoverBorder: 'hover:border-teal-400/50', glow: 'hover:shadow-[0_0_15px_rgba(45,212,191,0.3)]' },
    { icon: Trash2, label: 'Decluttering', color: 'text-gray-400', hoverBorder: 'hover:border-gray-400/50', glow: 'hover:shadow-[0_0_15px_rgba(156,163,175,0.3)]' },
  ];

  return (
    <section id="how-it-works" className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            <span className="text-white block mb-2">One question.</span>
            <span className="text-gradient-animated block">A completely different digital life.</span>
          </motion.h2>
        </div>

        <motion.div 
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="glass-l3 rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="noise-overlay opacity-20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl text-white mb-8 text-center font-medium">What's changing in your life?</h3>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {transitions.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    className={`glass-l1 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 border border-white/5 cursor-pointer hover:-translate-y-1 hover:scale-[1.02] ${t.hoverBorder} ${t.glow}`}
                  >
                    <div className={`p-2 rounded-lg bg-white/5 ${t.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200 font-medium">{t.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
