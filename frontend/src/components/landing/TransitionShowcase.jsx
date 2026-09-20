import React, { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe2, Briefcase, HeartCrack, Palmtree, Users, Trash2 } from 'lucide-react';

const Card3D = ({ item }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const Icon = item.icon;

  const handleMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / 10;
    const tiltY = (centerX - x) / 10;
    
    setRotateX(tiltX);
    setRotateY(tiltY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`glass-l2 rounded-2xl p-8 min-h-[240px] flex flex-col justify-between group cursor-pointer transition-colors duration-300 border border-white/5 ${item.hoverBorder} ${item.glow}`}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out, border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
      </div>
      <div className="mt-6 overflow-hidden">
        <p className={`text-sm font-medium flex items-center gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ${item.color}`}>
          <span>Learn more</span>
          <span className="text-lg leading-none">→</span>
        </p>
      </div>
    </motion.div>
  );
};

export default function TransitionShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const data = [
    { icon: Globe2, title: 'Moving Abroad', desc: 'Cancel geo-locked services, convert bank accounts, migrate global tools.', color: 'text-blue-400', hoverBorder: 'hover:border-blue-400/50', glow: 'hover:shadow-[0_8px_30px_rgba(96,165,250,0.15)]' },
    { icon: Briefcase, title: 'New Job', desc: 'Transfer work tools, revoke corporate access, update billing.', color: 'text-indigo-400', hoverBorder: 'hover:border-indigo-400/50', glow: 'hover:shadow-[0_8px_30px_rgba(129,140,248,0.15)]' },
    { icon: HeartCrack, title: 'Breakup', desc: 'Split shared subscriptions, remove access, secure personal accounts.', color: 'text-rose-400', hoverBorder: 'hover:border-rose-400/50', glow: 'hover:shadow-[0_8px_30px_rgba(251,113,133,0.15)]' },
    { icon: Palmtree, title: 'Retirement', desc: 'Close work accounts, simplify subscriptions, preserve memories.', color: 'text-amber-400', hoverBorder: 'hover:border-amber-400/50', glow: 'hover:shadow-[0_8px_30px_rgba(251,191,36,0.15)]' },
    { icon: Users, title: 'Family Affairs', desc: 'Handle estate digital assets, transfer plans, memorialize.', color: 'text-teal-400', hoverBorder: 'hover:border-teal-400/50', glow: 'hover:shadow-[0_8px_30px_rgba(45,212,191,0.15)]' },
    { icon: Trash2, title: 'Decluttering', desc: 'Cancel unused services, consolidate accounts, reduce noise.', color: 'text-gray-400', hoverBorder: 'hover:border-gray-400/50', glow: 'hover:shadow-[0_8px_30px_rgba(156,163,175,0.15)]' },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          ref={ref}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.map((item, i) => (
            <Card3D key={i} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
