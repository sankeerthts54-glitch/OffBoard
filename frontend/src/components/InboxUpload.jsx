import { useState } from 'react';
import { UploadCloud, Database, Loader2 } from 'lucide-react';
import { scanInbox } from '../api/offboard';
import { SAMPLE_INBOX } from '../data/sampleInbox';

export default function InboxUpload({ onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const handleDemoData = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const sessionId = 'demo-session-' + Date.now();
      const res = await scanInbox(sessionId, SAMPLE_INBOX);
      onScanComplete(res.session_id, res.accounts);
    } catch (err) {
      setError("Failed to scan inbox.");
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <Loader2 size={48} className="text-primary-500 animate-spin mb-6" />
        <h3 className="text-xl font-medium text-white mb-2">Scanning your digital footprint...</h3>
        <p className="text-gray-400">Finding accounts, subscriptions, and active services.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Connect your data</h2>
        <p className="text-gray-400 text-lg">We need to scan your recent receipts and emails to identify active accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-gray-500 hover:bg-gray-800/50 transition-all cursor-pointer">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Upload JSON Data</h3>
          <p className="text-sm text-gray-400 mb-6">Drag and drop your Google Takeout or custom JSON file here.</p>
          <button className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors">
            Select File
          </button>
        </div>

        <div className="border-2 border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-800/30">
          <div className="w-16 h-16 bg-primary-900/30 rounded-full flex items-center justify-center text-primary-400 mb-4">
            <Database size={32} />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Use Demo Data</h3>
          <p className="text-sm text-gray-400 mb-6">Try out the experience with a pre-configured sample inbox.</p>
          <button 
            onClick={handleDemoData}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/20"
          >
            Load Sample Data
          </button>
        </div>
      </div>
      {error && (
        <div className="text-red-400 text-center mt-4 p-3 bg-red-900/20 rounded-lg max-w-md mx-auto border border-red-900/50">
          {error}
        </div>
      )}
    </div>
  );
}
