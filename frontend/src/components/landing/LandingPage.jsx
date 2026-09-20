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
    // Transparent root — background is handled by AnimatedBackground (fixed layer z:0)
    <div className="relative min-h-screen text-gray-100 font-sans overflow-x-hidden bg-[#060612]">

      {/* Fixed animated background — sits at z:0 behind everything */}
      <AnimatedBackground />

      {/* Fixed navigation — z:50 */}
      <Navbar onStart={onStart} />

      {/* All sections — z:10 so they sit above the background */}
      <main className="relative" style={{ zIndex: 10 }}>

        <section className="min-h-screen flex flex-col justify-center">
          <HeroSection onStart={onStart} />
        </section>

        <div className="section-divider" />
        <section id="product" className="py-24 px-4 sm:px-6">
          <ProblemSection />
        </section>

        <div className="section-divider" />
        <section id="how-it-works" className="py-24 px-4 sm:px-6">
          <WhatIsSection />
        </section>

        <div className="section-divider" />
        <section className="py-24 px-4 sm:px-6">
          <TransitionShowcase />
        </section>

        <div className="section-divider" />
        <section id="ai-engine" className="py-24 px-4 sm:px-6">
          <AIEngineSection />
        </section>

        <div className="section-divider" />
        <section className="py-24 px-4 sm:px-6">
          <AutomationSection />
        </section>

        <div className="section-divider" />
        <section id="technology" className="py-24 px-4 sm:px-6">
          <ArchitectureSection />
        </section>

        <div className="section-divider" />
        <section id="security" className="py-24 px-4 sm:px-6">
          <SecuritySection />
        </section>

        <div className="section-divider" />
        <section className="py-24 px-4 sm:px-6">
          <TransformationSection />
        </section>

        <section className="py-32 px-4 sm:px-6">
          <CTASection onStart={onStart} />
        </section>

        <Footer />
      </main>
    </div>
  );
}
