import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function TransformationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const beforeAccounts = [
    { name: 'Netflix', status: 'Unknown status', rotation: -6, x: -10, y: 10 },
    { name: 'AWS Console', status: 'Needs attention', rotation: 8, x: 20, y: -5 },
    { name: 'Twitter', status: 'Needs attention', rotation: -3, x: 5, y: -15 },
    { name: 'Dropbox', status: 'Unknown status', rotation: 12, x: -20, y: 25 },
    { name: 'Adobe CC', status: 'Needs attention', rotation: -8, x: 15, y: 30 },
    { name: 'Slack', status: 'Unknown status', rotation: 5, x: -5, y: -25 },
    { name: 'Github', status: 'Needs attention', rotation: -12, x: 25, y: 15 },
    { name: 'Spotify', status: 'Unknown status', rotation: 4, x: -15, y: -10 },
  ];

  const afterAccounts = [
    { name: 'Netflix', status: 'CANCELLED' },
    { name: 'AWS Console', status: 'TRANSFERRED' },
    { name: 'Twitter', status: 'KEPT' },
    { name: 'Dropbox', status: 'CANCELLED' },
    { name: 'Adobe CC', status: 'CANCELLED' },
    { name: 'Slack', status: 'TRANSFERRED' },
    { name: 'Github', status: 'TRANSFERRED' },
    { name: 'Spotify', status: 'KEPT' },
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="transformation">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white text-center mb-20"
        >
          See the transformation.
        </motion.h2>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-16">
          
          {/* Before Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 rounded-3xl border border-red-500/20 bg-red-950/10 p-8 min-h-[400px] flex flex-col items-center relative"
          >
            <h3 className="text-red-400 font-bold tracking-widest mb-12">BEFORE</h3>
            <div className="relative w-full h-full flex items-center justify-center">
              {beforeAccounts.map((acc, i) => (
                <div 
                  key={i} 
                  className="absolute glass-l1 p-3 rounded-lg border border-red-500/30 w-48 shadow-lg bg-black/40"
                  style={{
                    transform: `rotate(${acc.rotation}deg) translate(${acc.x}px, ${acc.y}px)`,
                    zIndex: i
                  }}
                >
                  <div className="text-gray-200 font-medium text-sm">{acc.name}</div>
                  <div className="text-red-400/80 text-xs mt-1">{acc.status}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Center Badge */}
          <div className="hidden md:flex flex-col justify-center items-center">
            <div className="glass-l3 px-4 py-2 rounded-full text-indigo-400 font-bold tracking-wider text-sm glow-indigo border border-indigo-500/30 z-10">
              OFFBOARD
            </div>
          </div>

          {/* After Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="flex-1 rounded-3xl border border-green-500/20 bg-green-950/10 p-8 min-h-[400px] flex flex-col"
          >
            <h3 className="text-green-400 font-bold tracking-widest text-center mb-8">AFTER</h3>
            <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
              {afterAccounts.map((acc, i) => (
                <div key={i} className="glass-l2 p-3 rounded-lg flex justify-between items-center border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-gray-200 font-medium text-sm">{acc.name}</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    acc.status === 'CANCELLED' ? 'bg-gray-800 text-gray-400' :
                    acc.status === 'TRANSFERRED' ? 'bg-blue-900/30 text-blue-400' :
                    'bg-green-900/30 text-green-400'
                  }`}>
                    {acc.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
