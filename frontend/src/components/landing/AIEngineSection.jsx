import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Scan, Brain, GitBranch, Zap } from 'lucide-react';

export default function AIEngineSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const pipeline = [
    { icon: Mail, title: 'INBOX', desc: 'Your emails' },
    { icon: Scan, title: 'AI SCAN', desc: 'Pattern detection' },
    { icon: Brain, title: 'CLASSIFY', desc: 'Smart classification' },
    { icon: GitBranch, title: 'DECIDE', desc: 'Action planning' },
    { icon: Zap, title: 'EXECUTE', desc: 'Automated actions' }
  ];

  const examples = [
    { text: 'Netflix Premium ₹649/mo', badge: 'CANCEL', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { text: 'HDFC Savings Account', badge: 'KEEP', badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { text: 'Shared Dropbox', badge: 'TRANSFER', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { text: 'Company Slack', badge: 'MIGRATE', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
  ];

  return (
    <section id="ai-engine" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            <span className="text-white block mb-2">AI that understands</span>
            <span className="text-gradient-animated block">what needs to happen next.</span>
          </motion.h2>
        </div>

        <div ref={ref} className="relative">
          {/* Pipeline */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative z-20 mb-16">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10 transform -translate-y-1/2">
              <motion.div 
                initial={{ width: 0 }}
                animate={isInView ? { width: '100%' } : {}}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
              />
            </div>

            {pipeline.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="glass-l2 rounded-2xl p-6 w-40 flex flex-col items-center gap-3 border border-white/10 relative bg-[#0a0a1a]"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-200 tracking-wider">{stage.title}</h4>
                  <p className="text-xs text-gray-500 text-center">{stage.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Examples Flow */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 1.2 } }
              }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-col gap-3"
            >
              {examples.map((ex, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="glass-l1 rounded-xl p-4 flex items-center justify-between border border-white/5"
                >
                  <span className="text-gray-300 font-medium">{ex.text}</span>
                  <span className={`text-xs px-3 py-1 rounded-full border font-semibold tracking-wider ${ex.badgeColor}`}>
                    {ex.badge}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-gray-500">
              Powered by Amazon Bedrock — Claude AI understands context, not just keywords.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
