import React from 'react';
import { Rocket } from 'lucide-react';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative mt-20">
      <div className="section-divider" />
      <div className="glass-l1 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Rocket className="text-indigo-500" size={24} />
            <span className="text-gradient font-bold text-xl tracking-tight">Offboard</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 font-medium">
            <button onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">Product</button>
            <button onClick={() => scrollTo('automation')} className="hover:text-white transition-colors">How It Works</button>
            <button onClick={() => scrollTo('technology')} className="hover:text-white transition-colors">Technology</button>
            <button onClick={() => scrollTo('security')} className="hover:text-white transition-colors">Security</button>
          </div>

          {/* Right */}
          <div className="text-sm font-medium text-gray-400">
            Built for AWS Bharat Builds 2026
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 text-center md:text-left">
          <p className="text-xs text-gray-700">
            © 2026 Offboard. Your digital life, sorted.
          </p>
        </div>
      </div>
    </footer>
  );
}
