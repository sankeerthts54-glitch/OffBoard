import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const nodes = [
  { id: 1, name: 'Netflix', status: 'CANCEL', color: 'bg-red-400', top: '10%', left: '20%' },
  { id: 2, name: 'Spotify', status: 'KEEP', color: 'bg-green-400', top: '25%', left: '75%' },
  { id: 3, name: 'HDFC Bank', status: 'MIGRATE', color: 'bg-amber-400', top: '75%', left: '15%' },
  { id: 4, name: 'AWS', status: 'MIGRATE', color: 'bg-amber-400', top: '80%', left: '60%' },
  { id: 5, name: 'Slack', status: 'TRANSFER', color: 'bg-blue-400', top: '50%', left: '85%' },
  { id: 6, name: 'Adobe', status: 'CANCEL', color: 'bg-red-400', top: '15%', left: '50%' },
  { id: 7, name: 'Google', status: 'KEEP', color: 'bg-green-400', top: '90%', left: '40%' },
  { id: 8, name: 'LinkedIn', status: 'KEEP', color: 'bg-green-400', top: '40%', left: '10%' },
  { id: 9, name: 'Airtel', status: 'TRANSFER', color: 'bg-blue-400', top: '65%', left: '80%' },
  { id: 10, name: 'Zomato', status: 'CANCEL', color: 'bg-red-400', top: '30%', left: '35%' },
];

export default function HeroVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full max-w-3xl h-[400px] md:h-[500px] mx-auto perspective-1000">
      <motion.div
        className="w-full h-full relative"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {nodes.map((node) => (
            <line
              key={`line-${node.id}`}
              x1="50%"
              y1="50%"
              x2={node.left}
              y2={node.top}
              stroke="rgba(99,102,241,0.15)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          ))}
        </svg>

        {/* Central Brain Node */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="glass-l3 w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-2xl flex flex-col items-center justify-center border border-indigo-500/30 glow-indigo relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
            <Brain className="w-12 h-12 md:w-16 md:h-16 text-indigo-400 mb-2 relative z-10" />
            <span className="text-white font-bold text-sm md:text-base relative z-10">Digital Life</span>
          </div>
        </div>

        {/* Orbiting Nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            className="absolute z-20"
            style={{ top: node.top, left: node.left }}
            animate={{
              y: [0, Math.random() > 0.5 ? -8 : -12, 0],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          >
            <div className="glass-l2 border border-white/10 rounded-xl px-3 py-2 flex flex-col items-center gap-1 shadow-lg backdrop-blur-sm whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${node.color}`}></div>
                <span className="text-sm font-medium text-gray-200">{node.name}</span>
              </div>
              {node.status && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 ${node.color.replace('bg-', 'text-')}`}>
                  {node.status}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
