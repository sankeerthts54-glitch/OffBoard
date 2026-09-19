import { useState } from 'react';
import { Play, CheckSquare, Square, AlertTriangle, Zap, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { executeActions } from '../api/offboard';

export default function ActionPanel({ sessionId, accounts, onActionsStarted }) {
  const autoAccounts = accounts.filter(a => a.classification === 'CANCEL' && a.auto_actionable);
  const manualAccounts = accounts.filter(a => !a.auto_actionable || a.classification !== 'CANCEL');

  const [selectedIds, setSelectedIds] = useState(new Set(autoAccounts.map(a => a.account_id)));
  const [isExecuting, setIsExecuting] = useState(false);
  const [manualDone, setManualDone] = useState(new Set());
  const [executeError, setExecuteError] = useState(null);

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleManualDone = (id) => {
    setManualDone(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(autoAccounts.map(a => a.account_id)));
  const selectNone = () => setSelectedIds(new Set());

  const handleExecute = async () => {
    if (selectedIds.size === 0) return;
    setIsExecuting(true);
    setExecuteError(null);
    try {
      await executeActions(sessionId, Array.from(selectedIds));
      onActionsStarted();
    } catch (err) {
      console.error(err);
      setExecuteError('Execution failed. Please try again.');
      setIsExecuting(false);
    }
  };

  const manualDoneCount = manualDone.size;
  const manualTotal = manualAccounts.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs text-gray-400 font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Step 4 of 5 · Execute Actions
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Execute Actions</h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Review what Offboard will handle automatically, and tick off manual tasks yourself.
        </p>
      </div>

      {/* Overview chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-900/20 border border-amber-700/30">
          <Zap size={14} className="text-amber-400" />
          <span className="text-sm font-semibold text-amber-200">{autoAccounts.length} Auto-cancel</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700/30">
          <AlertTriangle size={14} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-300">{manualAccounts.length} Manual steps</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900/20 border border-green-700/30">
          <CheckCircle2 size={14} className="text-green-400" />
          <span className="text-sm font-semibold text-green-200">{manualDoneCount} of {manualTotal} manual done</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auto-cancellations panel */}
        <div className="glass-card rounded-2xl border border-amber-900/20 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-amber-900/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-700/30 flex items-center justify-center">
                <Zap size={16} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Automated Cancellations</h3>
                <p className="text-[10px] text-gray-500">Offboard handles these for you</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-900/40 border border-amber-700/30 text-amber-300 text-xs font-semibold">
              {selectedIds.size} selected
            </span>
          </div>

          {/* Select all / none */}
          {autoAccounts.length > 0 && (
            <div className="flex gap-2 px-4 pt-3 pb-1">
              <button onClick={selectAll} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Select all</button>
              <span className="text-gray-700">·</span>
              <button onClick={selectNone} className="text-xs text-gray-500 hover:text-gray-400 font-medium transition-colors">Deselect all</button>
            </div>
          )}

          <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
            {autoAccounts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-3xl mb-2">👍</div>
                <p>No automated actions available.</p>
              </div>
            ) : (
              autoAccounts.map(account => {
                const checked = selectedIds.has(account.account_id);
                return (
                  <div
                    key={account.account_id}
                    onClick={() => toggleSelect(account.account_id)}
                    className={`px-4 py-3.5 flex items-center gap-3 cursor-pointer transition-all duration-150 ${
                      checked ? 'bg-indigo-900/10' : 'hover:bg-white/3'
                    }`}
                  >
                    <div className={`shrink-0 transition-colors ${checked ? 'text-indigo-400' : 'text-gray-600'}`}>
                      {checked ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm">{account.service_name}</div>
                      <div className="text-xs text-gray-500 capitalize truncate">
                        {account.category?.replace(/_/g, ' ')} · {account.next_step?.slice(0, 40)}…
                      </div>
                    </div>
                    <div className={`shrink-0 w-2 h-2 rounded-full ${checked ? 'bg-indigo-400' : 'bg-gray-700'}`} />
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/10">
            {executeError && (
              <p className="text-red-400 text-xs mb-2 flex items-center gap-1">
                <AlertTriangle size={12} />
                {executeError}
              </p>
            )}
            <button
              onClick={handleExecute}
              disabled={isExecuting || selectedIds.size === 0}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg glow-indigo hover:scale-[1.01]"
            >
              {isExecuting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Executing {selectedIds.size} cancellations...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Execute {selectedIds.size} Auto-Cancellations
                </>
              )}
            </button>
            <p className="text-[10px] text-gray-600 text-center mt-2">
              This will start automated cancellation via Step Functions
            </p>
          </div>
        </div>

        {/* Manual checklist panel */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center">
                <AlertTriangle size={16} className="text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Manual Action Checklist</h3>
                <p className="text-[10px] text-gray-500">Tick off as you complete each step</p>
              </div>
            </div>
            {manualTotal > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${(manualDoneCount / manualTotal) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500">{manualDoneCount}/{manualTotal}</span>
              </div>
            )}
          </div>

          <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
            {manualAccounts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-3xl mb-2">✨</div>
                <p>Everything is automated!</p>
              </div>
            ) : (
              manualAccounts.map(account => {
                const done = manualDone.has(account.account_id);
                const clsEmoji = {
                  KEEP: '✅', TRANSFER: '🔄', MIGRATE: '📦', CLOSE_OR_MEMORIALIZE: '🕯️', CANCEL: '🚫'
                }[account.classification] || '📋';

                return (
                  <div
                    key={account.account_id}
                    className={`px-4 py-3.5 transition-all duration-200 ${done ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleManualDone(account.account_id)}
                        className={`mt-0.5 shrink-0 w-4 h-4 rounded border transition-all ${
                          done
                            ? 'bg-green-600 border-green-500 flex items-center justify-center'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {done && <span className="text-white text-[10px] font-bold">✓</span>}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span>{clsEmoji}</span>
                          <span className={`font-semibold text-sm ${done ? 'line-through text-gray-500' : 'text-white'}`}>
                            {account.service_name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                            account.classification === 'KEEP' ? 'bg-green-900/30 text-green-400 border-green-800/30' :
                            account.classification === 'TRANSFER' ? 'bg-blue-900/30 text-blue-400 border-blue-800/30' :
                            account.classification === 'MIGRATE' ? 'bg-amber-900/30 text-amber-400 border-amber-800/30' :
                            account.classification === 'CLOSE_OR_MEMORIALIZE' ? 'bg-gray-800 text-gray-400 border-gray-700' :
                            'bg-red-900/30 text-red-400 border-red-800/30'
                          }`}>
                            {account.classification?.replace('_OR_', '/')}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${done ? 'text-gray-600' : 'text-gray-400'}`}>
                          {account.next_step}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {manualTotal > 0 && (
            <div className="p-3 border-t border-white/5 bg-black/10">
              <div className="flex items-start gap-2 text-[11px] text-gray-600">
                <Info size={12} className="shrink-0 mt-0.5" />
                <span>Manual tasks are not sent to the API — just track your progress here.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
