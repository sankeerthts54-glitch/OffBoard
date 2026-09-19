import { Zap, ChevronDown } from 'lucide-react';

export default function AccountCard({ account }) {
  const colorMap = {
    'KEEP': 'bg-green-900/20 text-green-400 border-green-900/50',
    'TRANSFER': 'bg-blue-900/20 text-blue-400 border-blue-900/50',
    'CANCEL': 'bg-red-900/20 text-red-400 border-red-900/50',
    'CLOSE_OR_MEMORIALIZE': 'bg-gray-700/50 text-gray-300 border-gray-600',
    'MIGRATE': 'bg-amber-900/20 text-amber-400 border-amber-900/50',
  };

  const badgeClass = colorMap[account.classification] || 'bg-gray-800 text-gray-400 border-gray-700';

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {account.service_name}
            {account.auto_actionable && (
              <span title="Auto-actionable" className="text-amber-400 bg-amber-400/10 p-1 rounded">
                <Zap size={14} />
              </span>
            )}
          </h3>
          <span className="text-xs text-gray-500">{account.category} • {account.billing_status}</span>
        </div>
        
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass} flex items-center gap-1 cursor-pointer hover:opacity-80`}>
          {account.classification}
          <ChevronDown size={12} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-300 bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-left">
          <span className="font-medium text-gray-500 block mb-1 text-xs uppercase tracking-wider">AI Reasoning</span>
          {account.reason || 'Standard review applied based on transition context.'}
        </p>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-700">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="flex gap-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${account.confidence === 'high' ? 'bg-green-500' : 'bg-gray-600'}`}></span>
            <span className={`w-1.5 h-1.5 rounded-full ${account.confidence === 'high' || account.confidence === 'medium' ? 'bg-green-500' : 'bg-gray-600'}`}></span>
            <span className={`w-1.5 h-1.5 rounded-full ${account.confidence === 'high' ? 'bg-green-500' : 'bg-gray-600'}`}></span>
          </span>
          {account.confidence} confidence
        </div>
        <div className="text-xs font-medium text-gray-300">
          {account.next_step}
        </div>
      </div>
    </div>
  );
}
