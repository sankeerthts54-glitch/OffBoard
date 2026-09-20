import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Sparkles, Code, Database, GitBranch, Clock, Bell, Globe } from 'lucide-react';

export default function ArchitectureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredNode, setHoveredNode] = useState(null);

  const satellites = [
    { name: 'Amazon Bedrock', icon: Sparkles, color: 'text-violet-400', desc: 'AI orchestration and reasoning' },
    { name: 'AWS Lambda', icon: Code, color: 'text-amber-400', desc: 'Serverless execution' },
    { name: 'DynamoDB', icon: Database, color: 'text-blue-400', desc: 'State and user data' },
    { name: 'Step Functions', icon: GitBranch, color: 'text-green-400', desc: 'Workflow management' },
    { name: 'EventBridge', icon: Clock, color: 'text-cyan-400', desc: 'Event routing' },
    { name: 'SNS', icon: Bell, color: 'text-rose-400', desc: 'Notifications' },
    { name: 'Amplify', icon: Globe, color: 'text-indigo-400', desc: 'Frontend hosting' }
  ];

  return (
    <section className="py-24 relative" id="technology">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          Built serverlessly on AWS.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-400 text-lg"
        >
          Event-driven infrastructure that scales from one transition to millions.
        </motion.p>
      </div>

      <div className="relative w-full max-w-2xl h-[500px] mx-auto hidden md:block" ref={ref}>
        {/* Center Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 glass-l3 rounded-2xl p-6 flex flex-col items-center gap-2 glow-indigo"
        >
          <Brain size={48} className="text-indigo-500" />
          <span className="text-white font-bold text-sm tracking-widest text-center max-w-[120px]">
            OFFBOARD AI ENGINE
          </span>
        </motion.div>

        {/* Satellites */}
        {satellites.map((node, index) => {
          const angle = (index / satellites.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 200;
          const top = `calc(50% + ${Math.sin(angle) * radius}px)`;
          const left = `calc(50% + ${Math.cos(angle) * radius}px)`;
          const Icon = node.icon;

          return (
            <React.Fragment key={index}>
              {/* Connection Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={left}
                  y2={top}
                  stroke={hoveredNode === index ? '#8b5cf6' : '#374151'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>

              {/* Satellite Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: "spring", delay: 0.5 + index * 0.1 }}
                style={{ top, left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 glass-l1 rounded-xl p-3 flex items-center gap-2 cursor-pointer transition-transform duration-200 z-10"
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <Icon size={20} className={node.color} />
                <span className="text-gray-200 text-xs font-medium whitespace-nowrap hidden lg:block">{node.name}</span>
                
                {/* Tooltip */}
                {hoveredNode === index && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 rounded-md text-xs text-gray-400 whitespace-nowrap shadow-xl border border-gray-800 pointer-events-none z-30">
                    {node.desc}
                  </div>
                )}
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Mobile fallback list */}
      <div className="md:hidden px-6 flex flex-wrap gap-4 justify-center">
        {satellites.map((node, i) => {
          const Icon = node.icon;
          return (
            <div key={i} className="glass-l1 rounded-xl p-3 flex items-center gap-2">
              <Icon size={16} className={node.color} />
              <span className="text-gray-200 text-xs">{node.name}</span>
            </div>
          )
        })}
      </div>
    </section>
  );
}
