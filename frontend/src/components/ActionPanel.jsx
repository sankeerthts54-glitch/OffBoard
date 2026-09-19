import { useState } from 'react';
import { Play, CheckSquare, Square, AlertTriangle, Zap } from 'lucide-react';
import { executeActions } from '../api/offboard';

export default function ActionPanel({ sessionId, accounts, onActionsStarted }) {
  const autoAccounts = accounts.filter(a => a.classification === 'CANCEL' && a.auto_actionable);
  const manualAccounts = accounts.filter(a => a.classification === 'CANCEL' && !a.auto_actionable);

  const [selectedIds, setSelectedIds] = useState(
    autoAccounts.map(a => a.account_id)
  );
  const [isExecuting, setIsExecuting] = useState(false);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await executeActions(sessionId, selectedIds);
      onActionsStarted();
    } catch (err) {
      console.error(err);
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-3">Execute Actions</h2>
        <p className="text-gray-400">Choose which cancellations you want Offboard to handle automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              Automated Cancellations
            </h3>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
              {selectedIds.length} selected
            </span>
          </div>
          
          <div className="divide-y divide-gray-700 max-h-[400px] overflow-y-auto">
            {autoAccounts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No automated actions available.</div>
            ) : (
              autoAccounts.map(account => (
                <div 
                  key={account.account_id} 
                  className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-750 transition-colors ${selectedIds.includes(account.account_id) ? 'bg-primary-900/10' : ''}`}
                  onClick={() => toggleSelect(account.account_id)}
                >
                  <div className="text-primary-500">
                    {selectedIds.includes(account.account_id) ? <CheckSquare size={20} /> : <Square size={20} className="text-gray-500" />}
                  </div>
                  <div>
                    <div className="font-medium text-white">{account.service_name}</div>
                    <div className="text-xs text-gray-400">{account.category}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <button 
              onClick={handleExecute}
              disabled={isExecuting || selectedIds.length === 0}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {isExecuting ? 'Executing...' : 'Execute Selected Actions'}
              {!isExecuting && <Play size={16} />}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Manual Actions Required
            </h3>
          </div>
          
          <div className="divide-y divide-gray-700 max-h-[400px] overflow-y-auto bg-gray-800/50">
            {manualAccounts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No manual actions required.</div>
            ) : (
              manualAccounts.map(account => (
                <div key={account.account_id} className="p-4">
                  <div className="font-medium text-white mb-1">{account.service_name}</div>
                  <div className="text-sm text-gray-400 mb-2">{account.next_step}</div>
                  <button className="text-xs text-primary-400 hover:text-primary-300 font-medium">
                    Mark as done
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
