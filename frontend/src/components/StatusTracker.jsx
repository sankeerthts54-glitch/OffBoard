import { useState, useEffect, useRef, useCallback } from 'react';
import { getStatus } from '../api/offboard';
import { CheckCircle2, XCircle, Loader2, ClipboardList, Download, RefreshCw, Trophy, Sparkles } from 'lucide-react';

function useConfetti() {
  const fired = useRef(false);
  const fire = useCallback(async () => {
    if (fired.current) return;
    fired.current = true;
    try {
      const confetti = (await import('canvas-confetti')).default;
      const end = Date.now() + 3000;
      const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#34d399', '#60a5fa'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } catch (e) {
      console.warn('Confetti not available', e);
    }
  }, []);
  return fire;
}

const STATUS_CONFIG = {
  CANCELLED: {
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-900/15 border-green-900/20',
    label: 'Cancelled',
    pulse: false,
  },
  EXECUTING: {
    icon: Loader2,
    color: 'text-amber-400',
    bg: 'bg-amber-900/15 border-amber-900/20',
    label: 'Executing...',
    pulse: true,
    spin: true,
  },
  FAILED: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-900/15 border-red-900/20',
    label: 'Failed',
    pulse: false,
  },
  MANUAL: {
    icon: ClipboardList,
    color: 'text-gray-400',
    bg: 'bg-gray-800/30 border-gray-700/20',
    label: 'Manual',
    pulse: false,
  },
  CLASSIFIED: {
    icon: ClipboardList,
    color: 'text-blue-400',
    bg: 'bg-blue-900/10 border-blue-900/20',
    label: 'Classified',
    pulse: false,
  },
  DETECTED: {
    icon: Loader2,
    color: 'text-gray-500',
    bg: 'bg-gray-800/20 border-gray-700/20',
    label: 'Queued',
    pulse: false,
  },
};

export default function StatusTracker({ sessionId, accounts }) {
  const [statusData, setStatusData] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [retrying, setRetrying] = useState(new Set());
  const [pollCount, setPollCount] = useState(0);
  const fireConfetti = useConfetti();

  useEffect(() => {
    // Initialize with classified accounts data
    setStatusData(accounts);

    const interval = setInterval(async () => {
      try {
        const res = await getStatus(sessionId);
        if (res.accounts) {
          setStatusData(res.accounts);
          setPollCount(p => p + 1);

          const autoAccs = res.accounts.filter(a => a.auto_actionable && a.classification === 'CANCEL');
          const allDone = autoAccs.length > 0 && autoAccs.every(a => a.status === 'CANCELLED' || a.status === 'FAILED');
          if (allDone) {
            setIsComplete(true);
            clearInterval(interval);
            fireConfetti();
          }
        }
      } catch (err) {
        console.error('Status poll failed', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionId, accounts, fireConfetti]);

  const handleRetry = async (accountId) => {
    setRetrying(prev => new Set([...prev, accountId]));
    // Optimistic update
    setTimeout(() => {
      setStatusData(prev => prev.map(a =>
        a.account_id === accountId ? { ...a, status: 'EXECUTING' } : a
      ));
      setRetrying(prev => { const n = new Set(prev); n.delete(accountId); return n; });
    }, 800);
  };

  const handleDownload = () => {
    const lines = [
      '# Offboard — Session Summary',
      `Session: ${sessionId}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '## Account Status Report',
      '---',
      ...statusData.map(acc => [
        `**${acc.service_name}** (${acc.category})`,
        `  Classification: ${acc.classification || 'N/A'}`,
        `  Status: ${acc.status || 'N/A'}`,
        `  Confidence: ${acc.confidence || 'N/A'}`,
        `  Reason: ${acc.reason || 'N/A'}`,
        `  Next Step: ${acc.next_step || 'N/A'}`,
        '',
      ].join('\n')),
      '---',
      `Total accounts: ${statusData.length}`,
      `Cancelled: ${statusData.filter(a => a.status === 'CANCELLED').length}`,
      `Manual: ${statusData.filter(a => !a.auto_actionable || a.classification !== 'CANCEL').length}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offboard-summary-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute progress from auto-actionable CANCEL accounts only
  const autoAccounts = statusData.filter(a => a.auto_actionable && a.classification === 'CANCEL');
  const cancelled = autoAccounts.filter(a => a.status === 'CANCELLED').length;
  const failed = autoAccounts.filter(a => a.status === 'FAILED').length;
  const done = cancelled + failed;
  const total = autoAccounts.length;
  const progressPercent = total === 0 ? 100 : Math.round((done / total) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs text-gray-400 font-medium mb-6">
          <span className={`w-2 h-2 rounded-full ${isComplete ? 'bg-green-400' : 'bg-indigo-400 animate-pulse'}`} />
          Step 5 of 5 · {isComplete ? 'Complete!' : 'Tracking Progress'}
        </div>

        {isComplete ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-6xl mb-4 animate-float">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-2">
              All done! <span className="text-gradient">Mission complete.</span>
            </h2>
            <p className="text-gray-400">Your digital life transition is underway.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Tracking Actions</h2>
            <p className="text-gray-400">
              Polling every 5s · <span className="text-indigo-400">{pollCount} update{pollCount !== 1 ? 's' : ''} received</span>
            </p>
          </div>
        )}
      </div>

      {/* Progress card */}
      {autoAccounts.length > 0 && (
        <div className="glass-card rounded-2xl border border-white/5 p-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <span className="font-semibold text-white text-sm">Automated Cancellations</span>
            </div>
            <span className="text-2xl font-bold text-gradient">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden mb-4 border border-white/5">
            <div
              className="progress-fill h-3 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-green-400 font-medium">✅ {cancelled} cancelled</span>
            {failed > 0 && <span className="text-red-400 font-medium">❌ {failed} failed</span>}
            <span className="text-gray-500">{total - done} remaining</span>
          </div>
        </div>
      )}

      {/* All accounts status list */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">All Accounts</h3>
        {statusData.map(account => {
          const statusKey = account.status || 'DETECTED';
          const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG['DETECTED'];
          const Icon = cfg.icon;
          const isRetrying = retrying.has(account.account_id);

          return (
            <div
              key={account.account_id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${cfg.bg}`}
            >
              <div className={cfg.color}>
                <Icon
                  size={20}
                  className={[cfg.spin ? 'animate-spin' : '', cfg.pulse ? 'animate-pulse' : ''].filter(Boolean).join(' ')}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{account.service_name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-500 capitalize">
                    {account.category?.replace(/_/g, ' ')}
                  </span>
                </div>
                {account.next_step && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{account.next_step}</p>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                {account.status === 'FAILED' && (
                  <button
                    onClick={() => handleRetry(account.account_id)}
                    disabled={isRetrying}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-900/30 hover:bg-red-900/50 border border-red-700/30 text-red-300 text-xs font-medium transition-colors"
                  >
                    <RefreshCw size={10} className={isRetrying ? 'animate-spin' : ''} />
                    Retry
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Download + celebrate */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 glass border border-white/10 hover:border-white/20 text-white rounded-xl font-medium transition-all duration-200 hover:bg-white/5"
        >
          <Download size={18} />
          Download Summary Report (.md)
        </button>
        {isComplete && (
          <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20 text-green-300 rounded-xl font-semibold animate-in fade-in">
            <Trophy size={18} className="text-green-400" />
            Transition complete!
          </div>
        )}
      </div>
    </div>
  );
}
