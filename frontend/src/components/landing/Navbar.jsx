import React, { useState, useEffect } from 'react';
import { Rocket, Menu, X } from 'lucide-react';

export default function Navbar({ onStart }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['product', 'how-it-works', 'technology', 'security'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Product', id: 'product' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'Technology', id: 'technology' },
    { name: 'Security', id: 'security' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-l2 py-3 border-b border-white/5 backdrop-blur-md' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Rocket className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold text-gradient">Offboard</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  activeSection === link.id ? 'text-indigo-400' : 'text-gray-400'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <button
              onClick={onStart}
              className="cta-glow bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Start Offboarding
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden glass-l2 border-t border-white/5 absolute top-full left-0 w-full animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="block text-base font-medium text-gray-300 hover:text-white px-3 py-2 rounded-md hover:bg-white/5"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onStart?.();
              }}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-lg text-sm font-medium transition-all"
            >
              Start Offboarding
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
