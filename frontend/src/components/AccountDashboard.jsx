import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { classifyAccounts } from '../api/offboard';
import AccountCard from './AccountCard';

export default function AccountDashboard({ sessionId, transitionType, accounts, onClassified }) {
  const [isClassifying, setIsClassifying] = useState(true);
  const [classifiedData, setClassifiedData] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const runClassification = async () => {
      try {
        const accountIds = accounts.map(a => a.account_id);
        const res = await classifyAccounts(sessionId, transitionType, accountIds);
        
        const merged = accounts.map(acc => {
          const classData = res.accounts?.find(c => c.account_id === acc.account_id);
          return { ...acc, ...classData };
        });
        
        setClassifiedData(merged);
        onClassified(merged);
      } catch (err) {
        console.error("Classification failed", err);
      } finally {
        setIsClassifying(false);
      }
    };
    
    if (accounts.length > 0) {
      runClassification();
    }
  }, [sessionId, transitionType, accounts, onClassified]);

  if (isClassifying) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <Loader2 size={48} className="text-primary-500 animate-spin mb-6" />
        <h3 className="text-xl font-medium text-white mb-2">Analyzing accounts...</h3>
        <p className="text-gray-400 max-w-md text-center">Our AI is determining the best action for each account based on your "{transitionType}" transition.</p>
      </div>
    );
  }

  const filteredData = filter === 'ALL' 
    ? classifiedData 
    : classifiedData.filter(a => a.classification === filter);

  const stats = {
    total: classifiedData.length,
    cancel: classifiedData.filter(a => a.classification === 'CANCEL').length,
    keep: classifiedData.filter(a => a.classification === 'KEEP').length,
    transfer: classifiedData.filter(a => a.classification === 'TRANSFER').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Recommended Actions</h2>
          <p className="text-gray-400 text-sm">Review AI recommendations before proceeding.</p>
        </div>
        
        <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'ALL' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            All ({stats.total})
          </button>
          <button 
            onClick={() => setFilter('CANCEL')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'CANCEL' ? 'bg-red-900/30 text-red-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Cancel ({stats.cancel})
          </button>
          <button 
            onClick={() => setFilter('KEEP')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'KEEP' ? 'bg-green-900/30 text-green-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Keep ({stats.keep})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map(account => (
          <AccountCard key={account.account_id} account={account} />
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-800/30 rounded-xl border border-gray-800 border-dashed">
            No accounts matching this filter.
          </div>
        )}
      </div>
    </div>
  );
}
