import { useState, useEffect } from 'react';
import { getStatus } from '../api/offboard';
import { CheckCircle, Clock, XCircle, Download } from 'lucide-react';

export default function StatusTracker({ sessionId, accounts }) {
  const [statusMap, setStatusMap] = useState({});
  const [overallStatus, setOverallStatus] = useState('in_progress');
  
  const autoAccounts = accounts.filter(a => a.classification === 'CANCEL' && a.auto_actionable);

  useEffect(() => {
    const initial = {};
    autoAccounts.forEach(a => initial[a.account_id] = 'pending');
    setStatusMap(initial);

    const interval = setInterval(async () => {
      try {
        const res = await getStatus(sessionId);
        if (res.results) {
          const newStatus = { ...initial };
          Object.keys(res.results).forEach(id => {
            newStatus[id] = res.results[id].status;
          });
          setStatusMap(newStatus);
        }
        
        if (res.status === 'completed') {
          setOverallStatus('completed');
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to poll status", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, autoAccounts]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'in_progress': return <Clock className="text-amber-500 animate-pulse" size={20} />;
      case 'failed': return <XCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'success': return <span className="text-green-500 text-sm font-medium">Cancelled</span>;
      case 'in_progress': return <span className="text-amber-500 text-sm font-medium">Processing...</span>;
      case 'failed': return <span className="text-red-500 text-sm font-medium">Failed</span>;
      default: return <span className="text-gray-500 text-sm font-medium">Queued</span>;
    }
  };

  const completedCount = Object.values(statusMap).filter(s => s === 'success' || s === 'failed').length;
  const totalCount = autoAccounts.length;
  const progressPercent = totalCount === 0 ? 100 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Action Status</h2>
        <p className="text-gray-400">Tracking the progress of your automated cancellations.</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Overall Progress</span>
          <span className="text-sm font-bold text-primary-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden">
          <div 
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="space-y-3">
          {autoAccounts.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No automated tasks running.</div>
          ) : (
            autoAccounts.map(account => {
              const status = statusMap[account.account_id] || 'pending';
              return (
                <div key={account.account_id} className="flex justify-between items-center p-3 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <span className="font-medium text-white">{account.service_name}</span>
                  </div>
                  {getStatusText(status)}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 border border-gray-700 hover:bg-gray-750 text-white rounded-lg font-medium transition-colors">
          <Download size={18} />
          Download Summary Report
        </button>
      </div>
    </div>
  );
}
