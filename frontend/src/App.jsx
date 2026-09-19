import { useState } from 'react';
import Layout from './components/Layout';
import TransitionPicker from './components/TransitionPicker';
import InboxUpload from './components/InboxUpload';
import AccountDashboard from './components/AccountDashboard';
import ActionPanel from './components/ActionPanel';
import StatusTracker from './components/StatusTracker';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [transitionType, setTransitionType] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [classifiedAccounts, setClassifiedAccounts] = useState([]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleScanComplete = (id, accountsData) => {
    setSessionId(id);
    setAccounts(accountsData);
    handleNext();
  };

  const handleClassified = (classifiedData) => {
    setClassifiedAccounts(classifiedData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TransitionPicker
            selected={transitionType}
            onSelect={(type) => setTransitionType(type)}
          />
        );
      case 2:
        return <InboxUpload onScanComplete={handleScanComplete} />;
      case 3:
        return (
          <AccountDashboard
            sessionId={sessionId}
            transitionType={transitionType}
            accounts={accounts}
            onClassified={handleClassified}
          />
        );
      case 4:
        return (
          <ActionPanel
            sessionId={sessionId}
            accounts={classifiedAccounts}
            onActionsStarted={handleNext}
          />
        );
      case 5:
        return (
          <StatusTracker
            sessionId={sessionId}
            accounts={classifiedAccounts}
          />
        );
      default:
        return null;
    }
  };

  // Steps where Next button is driven by the component itself (not shown here)
  const hiddenNext = [2, 4, 5];
  // Steps where Back is not applicable
  const hideBack = [5];

  return (
    <Layout currentStep={currentStep}>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        {renderStep()}

        {/* Navigation bar */}
        <div className="mt-10 flex justify-between items-center border-t border-white/5 pt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || hideBack.includes(currentStep)}
            className="flex items-center gap-2 px-5 py-2.5 glass border border-white/10 text-gray-300 rounded-xl hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
          >
            ← Back
          </button>

          <div className="text-xs text-gray-600 font-medium">
            Step {currentStep} of 5
          </div>

          {!hiddenNext.includes(currentStep) && (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && !transitionType}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-sm shadow-lg glow-indigo hover:scale-105"
            >
              {currentStep === 3 ? 'Proceed to Actions' : 'Next Step'} →
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
