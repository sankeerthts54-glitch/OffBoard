import { CheckCircle2 } from 'lucide-react';

const steps = [
  "Transition",
  "Scan Inbox",
  "Classify",
  "Action",
  "Track"
];

export default function Layout({ children, currentStep }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 border-b border-gray-700 py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-900/50">
              O
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-200">Offboard</h1>
              <p className="text-xs text-gray-400">Digital Life Transition Assistant</p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gray-800/50 border-b border-gray-700 py-3 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center relative">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isPast = stepNumber < currentStep;
            
            return (
              <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-colors ${
                  isActive ? 'bg-primary-600 text-white shadow-md shadow-primary-900/50' : 
                  isPast ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 
                  'bg-gray-800 text-gray-500 border border-gray-700'
                }`}>
                  {isPast ? <CheckCircle2 size={16} /> : stepNumber}
                </div>
                <span className={`text-xs ${isActive ? 'text-primary-400 font-medium' : isPast ? 'text-gray-400' : 'text-gray-600'}`}>
                  {step}
                </span>
              </div>
            );
          })}
          {/* Connecting line background */}
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-800 z-0 mx-[10%]" />
        </div>
      </div>

      <main className="flex-1 overflow-auto relative">
        {children}
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-6 px-6 text-center text-sm text-gray-500">
        <p>Built for AWS Hackathon • Offboard Project</p>
      </footer>
    </div>
  );
}
