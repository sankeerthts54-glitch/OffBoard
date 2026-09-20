import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

export default function SecuritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Shield,
      title: 'Encrypted at Rest',
      desc: 'All data stored in DynamoDB with AWS encryption by default.'
    },
    {
      icon: Lock,
      title: 'Permission-Based',
      desc: 'You control exactly which accounts to act on. Nothing happens without your approval.'
    },
    {
      icon: Eye,
      title: 'Auditable Actions',
      desc: 'Every action is logged via Step Functions. Full transparency into what happened.'
    },
    {
      icon: UserCheck,
      title: 'You Stay in Control',
      desc: 'Review AI recommendations before any action is taken. Override any classification.'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section className="py-24 relative" id="security" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            <span className="text-white block mb-2">Your digital life is personal.</span>
            <span className="text-gradient block">We treat it that way.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Built with security-first architecture.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index}
                variants={cardVariants}
                className="glass-l2 rounded-2xl p-8 hover:bg-white/[0.03] transition-colors"
              >
                <div className="glass-l1 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-indigo-400">
                  <Icon size={24} />
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
