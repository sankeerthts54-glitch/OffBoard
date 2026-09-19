import { CheckCircle2, Rocket } from 'lucide-react';

const steps = [
  { label: 'Transition', icon: '🌍' },
  { label: 'Scan Inbox', icon: '📧' },
  { label: 'Classify', icon: '🤖' },
  { label: 'Action', icon: '⚡' },
  { label: 'Track', icon: '📊' },
];

export default function Layout({ children, currentStep }) {
  return (
    <div className="min-h-screen flex flex-col gradient-bg text-gray-100 font-sans">
      {/* Ambient orbs */}
      <div className="orb w-96 h-96 bg-indigo-600 top-0 left-0" />
      <div className="orb w-80 h-80 bg-violet-600 bottom-20 right-0" />
      <div className="orb w-64 h-64 bg-blue-600 top-1/2 left-1/3" style={{ opacity: 0.08 }} />

      {/* Header */}
      <header className="relative z-20 glass border-b border-white/5 py-4 px-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-xl shadow-lg glow-indigo animate-pulse-glow">
                <Rocket size={18} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient tracking-tight">Offboard</h1>
              <p className="text-xs text-gray-500">Your digital life, sorted.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">Live Demo</span>
          </div>
        </div>
      </header>

      {/* Step Progress Bar */}
      <div className="relative z-10 glass border-b border-white/5 py-4 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="relative flex justify-between items-start">
            <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-gray-800 z-0" />
            {/* Progress fill */}
            <div
              className="absolute top-4 left-[10%] h-[2px] z-0 progress-fill rounded-full"
              style={{ width: `${Math.min(((currentStep - 1) / (steps.length - 1)) * 80, 80)}%` }}
            />

            {steps.map(({ label, icon }, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isPast = stepNumber < currentStep;

              return (
                <div key={label} className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg glow-indigo scale-110'
                      : isPast
                      ? 'bg-green-900/40 text-green-400 border border-green-600/40 scale-100'
                      : 'bg-gray-900 text-gray-600 border border-gray-700/50'
                  }`}>
                    {isPast ? <CheckCircle2 size={16} /> : (
                      <span className="text-xs">{isActive ? icon : stepNumber}</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium transition-colors ${
                    isActive ? 'text-indigo-400' : isPast ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-white/5 py-4 px-6 text-center">
        <p className="text-xs text-gray-600">
          Built for{' '}
          <span className="text-gradient font-semibold">AWS Bharat Builds 2026</span>
          {' '}• Offboard Team 🚀
        </p>
      </footer>
    </div>
  );
}
