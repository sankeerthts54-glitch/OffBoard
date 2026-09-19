import { useEffect, useState, useCallback } from 'react';
import { Loader2, LayoutGrid, Filter, Sparkles } from 'lucide-react';
import { classifyAccounts } from '../api/offboard';
import AccountCard from './AccountCard';

const FILTERS = [
  { key: 'ALL', label: 'All', emoji: '🔵' },
  { key: 'CANCEL', label: 'Cancel', emoji: '🚫' },
  { key: 'KEEP', label: 'Keep', emoji: '✅' },
  { key: 'TRANSFER', label: 'Transfer', emoji: '🔄' },
  { key: 'MIGRATE', label: 'Migrate', emoji: '📦' },
  { key: 'CLOSE_OR_MEMORIALIZE', label: 'Memorialize', emoji: '🕯️' },
];

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5 overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-5 w-32 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
        <div className="skeleton h-8 w-20 rounded-lg ml-2" />
      </div>
      <div className="skeleton h-16 w-full rounded-xl mb-4" />
      <div className="flex justify-between items-center pt-3 border-t border-white/5">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-3 w-28 rounded" />
      </div>
    </div>
  );
}

export default function AccountDashboard({ sessionId, transitionType, accounts, onClassified }) {
  const [isClassifying, setIsClassifying] = useState(true);
  const [classifiedData, setClassifiedData] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [classifyPhase, setClassifyPhase] = useState('Initializing AI model...');

  const phases = [
    'Initializing AI model...',
    'Analyzing subscription patterns...',
    'Mapping to transition context...',
    'Computing confidence scores...',
    'Generating recommendations...',
  ];

  // Stable callback reference
  const onClassifiedRef = useCallback(onClassified, []);

  useEffect(() => {
    let phaseIdx = 0;
    const phaseInterval = setInterval(() => {
      phaseIdx = Math.min(phaseIdx + 1, phases.length - 1);
      setClassifyPhase(phases[phaseIdx]);
    }, 450);

    const runClassification = async () => {
      try {
        const accountIds = accounts.map(a => a.account_id);
        const res = await classifyAccounts(sessionId, transitionType, accountIds);

        // Merge scan data with classification results
        const resultsArr = res.results || res.accounts || [];
        const merged = accounts.map(acc => {
          const classData = resultsArr.find(c => c.account_id === acc.account_id);
          return { ...acc, ...(classData || {}) };
        });

        clearInterval(phaseInterval);
        setClassifiedData(merged);
        onClassifiedRef(merged);
      } catch (err) {
        console.error('Classification failed', err);
        clearInterval(phaseInterval);
      } finally {
        setIsClassifying(false);
      }
    };

    if (accounts.length > 0) {
      runClassification();
    } else {
      clearInterval(phaseInterval);
      setIsClassifying(false);
    }

    return () => clearInterval(phaseInterval);
  }, [sessionId, transitionType, accounts]);

  if (isClassifying) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* AI Loading header */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs text-gray-400 font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Step 3 of 5 · AI Classification
          </div>
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-violet-900/50 border border-indigo-500/30 flex items-center justify-center mx-auto glow-indigo">
              <Sparkles size={36} className="text-indigo-400 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-2xl border border-indigo-500/20 animate-ping" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">AI is classifying your accounts</h2>
          <p className="text-indigo-300 font-medium animate-pulse">{classifyPhase}</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing {accounts.length} accounts for your <span className="text-indigo-400 font-medium">{transitionType?.replace(/_/g, ' ')}</span> transition</p>
        </div>

        {/* Skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: Math.min(accounts.length, 6) }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const stats = {
    total: classifiedData.length,
    cancel: classifiedData.filter(a => a.classification === 'CANCEL').length,
    keep: classifiedData.filter(a => a.classification === 'KEEP').length,
    transfer: classifiedData.filter(a => a.classification === 'TRANSFER').length,
    migrate: classifiedData.filter(a => a.classification === 'MIGRATE').length,
    memorialize: classifiedData.filter(a => a.classification === 'CLOSE_OR_MEMORIALIZE').length,
    autoActionable: classifiedData.filter(a => a.auto_actionable && a.classification === 'CANCEL').length,
  };

  const filteredData = filter === 'ALL' ? classifiedData : classifiedData.filter(a => a.classification === filter);

  const handleClassificationChange = (accountId, newClass) => {
    setClassifiedData(prev => prev.map(a => a.account_id === accountId ? { ...a, classification: newClass } : a));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="pt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs text-gray-400 font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          Step 3 of 5 · Recommended Actions
        </div>
        <h2 className="text-3xl font-bold text-white mb-1">AI Recommendations</h2>
        <p className="text-gray-400 text-sm">Review and override before proceeding</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-white', bg: 'glass border-white/5' },
          { label: 'Cancel', value: stats.cancel, color: 'text-red-300', bg: 'bg-red-900/10 border-red-900/20' },
          { label: 'Keep', value: stats.keep, color: 'text-green-300', bg: 'bg-green-900/10 border-green-900/20' },
          { label: 'Transfer', value: stats.transfer, color: 'text-blue-300', bg: 'bg-blue-900/10 border-blue-900/20' },
          { label: 'Migrate', value: stats.migrate, color: 'text-amber-300', bg: 'bg-amber-900/10 border-amber-900/20' },
          { label: 'Memorialize', value: stats.memorialize, color: 'text-gray-400', bg: 'bg-gray-800/20 border-gray-700/20' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-xl border p-3 text-center ${bg}`}>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Auto-actionable alert */}
      {stats.autoActionable > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-900/20 border border-amber-700/30 animate-in fade-in">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-amber-200 font-semibold text-sm">{stats.autoActionable} accounts can be cancelled automatically</p>
            <p className="text-amber-500 text-xs">These will appear in the Execute Actions step for one-click processing</p>
          </div>
        </div>
      )}

      {/* Filter pills + layout toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-gray-500" />
          {FILTERS.map(({ key, label, emoji }) => {
            const count = key === 'ALL' ? stats.total : classifiedData.filter(a => a.classification === key).length;
            if (key !== 'ALL' && count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  filter === key
                    ? 'bg-indigo-600/30 text-white border-indigo-500/50 shadow-sm'
                    : 'glass border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <LayoutGrid size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500">{filteredData.length} account{filteredData.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Account cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((account, i) => (
          <div
            key={account.account_id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${i * 50}ms`, animationDuration: '400ms' }}
          >
            <AccountCard account={account} onClassificationChange={handleClassificationChange} />
          </div>
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full py-16 text-center glass-card rounded-2xl border border-white/5 border-dashed">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500">No accounts matching this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
