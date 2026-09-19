import { useState, useRef, useCallback } from 'react';
import { UploadCloud, Database, Loader2, FileJson, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { scanInbox } from '../api/offboard';
import { SAMPLE_INBOX } from '../data/sampleInbox';

export default function InboxUpload({ onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState('');
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const scanPhases = [
    'Parsing inbox data...',
    'Detecting service providers...',
    'Identifying billing patterns...',
    'Building account inventory...',
    'Finalizing results...',
  ];

  const runScan = async (inboxData, sourceLabel) => {
    setIsScanning(true);
    setError(null);
    let phaseIndex = 0;
    setScanPhase(scanPhases[0]);

    const phaseInterval = setInterval(() => {
      phaseIndex = Math.min(phaseIndex + 1, scanPhases.length - 1);
      setScanPhase(scanPhases[phaseIndex]);
    }, 400);

    try {
      const sessionId = 'session-' + Date.now();
      const res = await scanInbox(sessionId, inboxData);
      clearInterval(phaseInterval);
      setScanPhase('✅ Found ' + res.accounts.length + ' accounts!');
      await new Promise(r => setTimeout(r, 600));
      onScanComplete(res.session_id, res.accounts);
    } catch (err) {
      clearInterval(phaseInterval);
      setError('Failed to scan inbox. Please try again.');
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDemoData = () => runScan(SAMPLE_INBOX, 'demo');

  const handleFileParse = useCallback(async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      setError('Please upload a valid .json file.');
      return;
    }
    setUploadedFile(file);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const inboxData = Array.isArray(parsed) ? parsed : parsed.emails || parsed.inbox || [];
      runScan(inboxData, file.name);
    } catch {
      setError('Invalid JSON file. Please check the format and try again.');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileParse(file);
  }, [handleFileParse]);

  const handleFileSelect = (e) => handleFileParse(e.target.files[0]);

  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
        {/* Animated scanner */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full glass border border-indigo-500/30 flex items-center justify-center">
            <Loader2 size={40} className="text-indigo-400 animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
          <div className="absolute inset-[-8px] rounded-full border border-indigo-500/10 animate-spin-slow" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Scanning your digital footprint...</h3>
        <p className="text-indigo-300 font-medium mb-6 animate-pulse">{scanPhase}</p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-500"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs text-gray-400 font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Step 2 of 5 · Connect Your Data
        </div>
        <h2 className="text-4xl font-bold text-white mb-3">
          Connect your <span className="text-gradient">inbox</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          We'll scan your emails to find active subscriptions and accounts.
          <span className="text-gray-500"> Your data never leaves your device.</span>
        </p>
      </div>

      {/* Two options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Upload JSON */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center 
            cursor-pointer transition-all duration-300 min-h-[240px]
            ${isDragOver
              ? 'border-indigo-500 bg-indigo-900/20 scale-[1.02]'
              : 'border-white/10 glass-card hover:border-white/20'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileSelect}
          />
          {uploadedFile ? (
            <>
              <CheckCircle2 size={40} className="text-green-400 mb-4" />
              <div className="flex items-center gap-2 mb-2">
                <FileJson size={16} className="text-green-400" />
                <span className="text-sm font-medium text-white">{uploadedFile.name}</span>
              </div>
              <p className="text-xs text-gray-500">Processing...</p>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center mb-4 transition-all ${isDragOver ? 'scale-110 border-indigo-500/50' : ''}`}>
                <UploadCloud size={28} className={isDragOver ? 'text-indigo-400' : 'text-gray-500'} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload JSON File</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag & drop your Google Takeout or<br />exported inbox JSON here
              </p>
              <div className="px-4 py-2 glass border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                Browse files
              </div>
              {isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-indigo-900/20 backdrop-blur-sm">
                  <p className="text-indigo-300 font-bold text-lg">Drop to upload</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Demo data */}
        <div className="relative border-2 border-indigo-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-900/20 to-violet-900/20 glass-card min-h-[240px] overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center mb-4 glow-indigo">
              <Sparkles size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Use Demo Data</h3>
            <p className="text-sm text-gray-400 mb-2">
              18 pre-loaded accounts across all categories —<br />ready for an impressive demo instantly.
            </p>
            <div className="flex flex-wrap gap-1 justify-center mb-6">
              {['Netflix', 'Spotify', 'Adobe', 'Zerodha', '+ 14 more'].map(tag => (
                <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 border border-white/10 text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={handleDemoData}
              className="group px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg glow-indigo hover:scale-105 flex items-center gap-2"
            >
              <Database size={16} />
              Load 18 Demo Accounts
            </button>
          </div>
        </div>
      </div>

      {/* Format hint */}
      <div className="max-w-3xl mx-auto">
        <details className="group">
          <summary className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors flex items-center gap-1.5">
            <span className="text-gray-700 group-open:rotate-90 transition-transform inline-block">▶</span>
            Expected JSON format for file upload
          </summary>
          <div className="mt-3 p-4 rounded-xl glass border border-white/5 font-mono text-xs text-gray-500 overflow-auto">
            {`[\n  {\n    "from": "no-reply@netflix.com",\n    "subject": "Your Netflix renewal",\n    "date": "2026-09-15T10:00:00Z",\n    "snippet": "We've billed ₹649 for your Premium plan..."\n  },\n  ...\n]`}
          </div>
        </details>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-500/20 text-red-300 text-sm animate-in fade-in">
          <AlertCircle size={18} className="shrink-0 text-red-400" />
          {error}
        </div>
      )}
    </div>
  );
}
