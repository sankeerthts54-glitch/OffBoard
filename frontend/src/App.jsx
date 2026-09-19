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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TransitionPicker 
          selected={transitionType} 
          onSelect={(type) => setTransitionType(type)} 
        />;
      case 2:
        return <InboxUpload 
          onScanComplete={(id, accountsData) => {
            setSessionId(id);
            setAccounts(accountsData);
            handleNext();
          }} 
        />;
      case 3:
        return <AccountDashboard 
          sessionId={sessionId}
          transitionType={transitionType}
          accounts={accounts}
          onClassified={(classifiedData) => setClassifiedAccounts(classifiedData)}
        />;
      case 4:
        return <ActionPanel 
          sessionId={sessionId}
          accounts={classifiedAccounts}
          onActionsStarted={handleNext}
        />;
      case 5:
        return <StatusTracker 
          sessionId={sessionId}
          accounts={classifiedAccounts}
        />;
      default:
        return null;
    }
  };

  return (
    <Layout currentStep={currentStep}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {renderStep()}
        
        <div className="mt-8 flex justify-between border-t border-gray-700 pt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          
          {currentStep !== 2 && currentStep !== 4 && currentStep !== 5 && (
            <button
              onClick={handleNext}
              disabled={!transitionType && currentStep === 1}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
