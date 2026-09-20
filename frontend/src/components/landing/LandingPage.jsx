import AnimatedBackground from './AnimatedBackground';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import WhatIsSection from './WhatIsSection';
import TransitionShowcase from './TransitionShowcase';
import AIEngineSection from './AIEngineSection';
import AutomationSection from './AutomationSection';
import ArchitectureSection from './ArchitectureSection';
import SecuritySection from './SecuritySection';
import TransformationSection from './TransformationSection';
import CTASection from './CTASection';
import Footer from './Footer';

export default function LandingPage({ onStart }) {
  return (
    <div className="relative min-h-screen landing-gradient-bg text-gray-100 font-sans overflow-x-hidden">
      {/* Fixed background layers */}
      <AnimatedBackground />
      <div className="noise-overlay" />

      {/* Fixed navigation */}
      <Navbar onStart={onStart} />

      {/* Scrollable content — z-10 keeps it above the background canvas */}
      <main className="relative z-10">

        {/* Hero */}
        <section className="min-h-screen flex flex-col justify-center">
          <HeroSection onStart={onStart} />
        </section>

        {/* The Problem */}
        <div className="section-divider" />
        <section id="product" className="py-24 px-4 sm:px-6">
          <ProblemSection />
        </section>

        {/* What is Offboard */}
        <div className="section-divider" />
        <section id="how-it-works" className="py-24 px-4 sm:px-6">
          <WhatIsSection />
        </section>

        {/* Life Transitions */}
        <div className="section-divider" />
        <section className="py-24 px-4 sm:px-6">
          <TransitionShowcase />
        </section>

        {/* AI Engine */}
        <div className="section-divider" />
        <section id="ai-engine" className="py-24 px-4 sm:px-6">
          <AIEngineSection />
        </section>

        {/* Automation */}
        <div className="section-divider" />
        <section className="py-24 px-4 sm:px-6">
          <AutomationSection />
        </section>

        {/* AWS Architecture */}
        <div className="section-divider" />
        <section id="technology" className="py-24 px-4 sm:px-6">
          <ArchitectureSection />
        </section>

        {/* Security */}
        <div className="section-divider" />
        <section id="security" className="py-24 px-4 sm:px-6">
          <SecuritySection />
        </section>

        {/* Before / After Transformation */}
        <div className="section-divider" />
        <section className="py-24 px-4 sm:px-6">
          <TransformationSection />
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 sm:px-6">
          <CTASection onStart={onStart} />
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
