import { useState } from 'react';
import { Zap, ChevronDown, Info, Users } from 'lucide-react';

const CLASSIFICATION_CONFIG = {
  KEEP: {
    badge: 'bg-green-900 text-green-300 border-green-700',
    bg: 'bg-green-900/10',
    border: 'border-green-900/30',
    glow: 'hover:shadow-green-900/20',
    label: 'Keep',
    emoji: '✅',
    dot: 'bg-green-500',
  },
  CANCEL: {
    badge: 'bg-red-900 text-red-300 border-red-700',
    bg: 'bg-red-900/10',
    border: 'border-red-900/30',
    glow: 'hover:shadow-red-900/20',
    label: 'Cancel',
    emoji: '🚫',
    dot: 'bg-red-500',
  },
  TRANSFER: {
    badge: 'bg-blue-900 text-blue-300 border-blue-700',
    bg: 'bg-blue-900/10',
    border: 'border-blue-900/30',
    glow: 'hover:shadow-blue-900/20',
    label: 'Transfer',
    emoji: '🔄',
    dot: 'bg-blue-500',
  },
  MIGRATE: {
    badge: 'bg-amber-900 text-amber-300 border-amber-700',
    bg: 'bg-amber-900/10',
    border: 'border-amber-900/30',
    glow: 'hover:shadow-amber-900/20',
    label: 'Migrate',
    emoji: '📦',
    dot: 'bg-amber-500',
  },
  CLOSE_OR_MEMORIALIZE: {
    badge: 'bg-gray-800 text-gray-400 border-gray-600',
    bg: 'bg-gray-800/20',
    border: 'border-gray-700/30',
    glow: 'hover:shadow-gray-900/20',
    label: 'Memorialize',
    emoji: '🕯️',
    dot: 'bg-gray-500',
  },
};

const CONFIDENCE_CONFIG = {
  high: { dots: [true, true, true], color: 'bg-green-500', label: 'high' },
  medium: { dots: [true, true, false], color: 'bg-yellow-500', label: 'medium' },
  low: { dots: [true, false, false], color: 'bg-red-500', label: 'low' },
};

const ALL_CLASSIFICATIONS = ['KEEP', 'CANCEL', 'TRANSFER', 'MIGRATE', 'CLOSE_OR_MEMORIALIZE'];

export default function AccountCard({ account, onClassificationChange }) {
  const [showOverride, setShowOverride] = useState(false);
  const [localClassification, setLocalClassification] = useState(account.classification);

  const cfg = CLASSIFICATION_CONFIG[localClassification] || CLASSIFICATION_CONFIG['KEEP'];
  const confidenceCfg = CONFIDENCE_CONFIG[account.confidence] || CONFIDENCE_CONFIG['medium'];

  const handleOverride = (newClass) => {
    setLocalClassification(newClass);
    setShowOverride(false);
    onClassificationChange?.(account.account_id, newClass);
  };

  const categoryLabel = account.category?.replace(/_/g, ' ');

  return (
    <div className={`
      relative glass-card rounded-2xl border p-5 overflow-hidden transition-all duration-300 hover:shadow-xl ${cfg.glow}
      ${cfg.bg} ${cfg.border}
    `}>
      {/* Left accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${cfg.dot}`} />

      <div className="pl-2">
        {/* Header row */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white truncate">{account.service_name}</h3>
              {account.auto_actionable && (
                <span
                  title="Auto-actionable — can be processed automatically"
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/40 border border-amber-700/40 text-amber-300 text-[10px] font-semibold shrink-0"
                >
                  <Zap size={10} />
                  Auto
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[11px] text-gray-500 capitalize">{categoryLabel}</span>
              {account.billing_status && (
                <>
                  <span className="text-gray-700">·</span>
                  <span className={`text-[11px] font-medium ${
                    account.billing_status === 'active_recurring' ? 'text-orange-400' :
                    account.billing_status === 'free' ? 'text-green-400' :
                    'text-gray-500'
                  }`}>
                    {account.billing_status === 'active_recurring' ? '💳 Recurring' :
                     account.billing_status === 'free' ? '🆓 Free' :
                     '❓ Unknown'}
                  </span>
                </>
              )}
              {account.shared_with && (
                <>
                  <span className="text-gray-700">·</span>
                  <span className="flex items-center gap-1 text-[11px] text-blue-400">
                    <Users size={10} />
                    Shared
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Classification badge with override */}
          <div className="relative ml-2 shrink-0">
            <button
              onClick={() => setShowOverride(!showOverride)}
              className={`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border 
                transition-all duration-200 hover:scale-105 ${cfg.badge}
              `}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
              <ChevronDown size={11} className={`transition-transform ${showOverride ? 'rotate-180' : ''}`} />
            </button>

            {showOverride && (
              <div className="absolute right-0 top-full mt-1 z-20 glass border border-white/10 rounded-xl shadow-2xl overflow-hidden w-44 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-[10px] text-gray-500 font-medium">Override classification</p>
                </div>
                {ALL_CLASSIFICATIONS.map(cls => {
                  const c = CLASSIFICATION_CONFIG[cls];
                  return (
                    <button
                      key={cls}
                      onClick={() => handleOverride(cls)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/5 ${
                        cls === localClassification ? 'text-white bg-white/5' : 'text-gray-400'
                      }`}
                    >
                      <span>{c.emoji}</span>
                      <span>{c.label}</span>
                      {cls === localClassification && <span className="ml-auto text-indigo-400">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* AI Reason */}
        <div className="mb-3 p-3 rounded-xl bg-black/20 border border-white/5">
          <div className="flex items-center gap-1 mb-1.5">
            <Info size={10} className="text-gray-500" />
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">AI Reasoning</span>
          </div>
          <p className="text-sm text-gray-300 italic leading-relaxed">
            {account.reason || 'Standard review applied based on transition context.'}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex justify-between items-center pt-3 border-t border-white/5">
          {/* Confidence dots */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {confidenceCfg.dots.map((filled, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${filled ? confidenceCfg.color : 'bg-gray-700'}`}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-500 capitalize">{confidenceCfg.label} confidence</span>
          </div>

          {/* Next step */}
          <div className="text-[11px] text-gray-400 font-medium max-w-[140px] text-right leading-tight truncate" title={account.next_step}>
            {account.next_step}
          </div>
        </div>
      </div>
    </div>
  );
}
