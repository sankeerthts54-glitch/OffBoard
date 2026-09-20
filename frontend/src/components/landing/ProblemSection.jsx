import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const cards = [
    { text: 'Netflix ₹649/mo', rot: -6, x: -40, y: -20 },
    { text: 'Spotify Premium', rot: 4, x: 30, y: 10 },
    { text: 'HDFC Savings', rot: -3, x: -20, y: 30 },
    { text: 'Adobe CC ₹4230/mo', rot: 8, x: 40, y: -30 },
    { text: 'Slack Workspace', rot: -5, x: 10, y: 40 },
    { text: 'Dropbox Shared', rot: 7, x: -30, y: 5 },
    { text: 'Gym Membership', rot: -8, x: 20, y: -15 },
    { text: 'Cloud Storage', rot: 3, x: -10, y: -40 },
    { text: 'LinkedIn Premium', rot: -4, x: 50, y: 20 },
    { text: 'Newsletter #47', rot: 6, x: -50, y: 10 },
    { text: 'Forgotten SaaS', rot: -7, x: 15, y: 25 },
    { text: 'Old Gaming Sub', rot: 5, x: -25, y: -25 },
  ];

  return (
    <section id="product" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Life transitions are complicated enough.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            When your life changes, your digital world becomes a tangled mess of subscriptions, accounts, and forgotten services.
          </motion.p>
        </div>

        <div ref={ref} className="relative min-h-[400px] flex flex-col items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto relative h-[300px]">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ 
                  rotate: card.rot, 
                  x: card.x * (Math.random() * 2 + 1), 
                  y: card.y * (Math.random() * 2 + 1),
                  opacity: 0,
                  scale: 0.8
                }}
                animate={isInView ? { 
                  rotate: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1,
                  scale: 1
                } : {}}
                transition={{ 
                  duration: 1.5, 
                  type: 'spring',
                  bounce: 0.2,
                  delay: i * 0.05 
                }}
                className="absolute inset-0 m-auto flex items-center justify-center pointer-events-none"
                style={{
                  gridColumn: (i % (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 4 : typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 2)) + 1,
                  gridRow: Math.floor(i / (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 4 : typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 2)) + 1,
                  position: isInView ? 'static' : 'absolute'
                }}
              >
                <div className="glass-l1 rounded-lg px-4 py-3 text-sm text-gray-300 shadow-xl whitespace-nowrap border border-white/5 w-full text-center truncate">
                  {card.text}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12 text-center"
          >
            <p className="text-gradient text-2xl font-medium tracking-wide">
              Offboard brings order to the mess.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
