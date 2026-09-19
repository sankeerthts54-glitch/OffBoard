const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USE_MOCK = true;

const generateId = () => Math.random().toString(36).substr(2, 9);

export async function scanInbox(sessionId, inboxData) {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        session_id: sessionId || generateId(),
        accounts: [
          { account_id: '1', service_name: 'Netflix', category: 'Entertainment', billing_status: 'active_recurring' },
          { account_id: '2', service_name: 'Gym', category: 'Health', billing_status: 'active_recurring' }
        ]
      }), 1500);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, data: inboxData })
  });
  return response.json();
}

export async function classifyAccounts(sessionId, transitionType, accountIds) {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        accounts: accountIds.map(id => ({
          account_id: id,
          classification: 'CANCEL',
          confidence: 'high',
          reason: 'Subscription typically not needed during this transition.',
          next_step: 'Cancel via portal',
          auto_actionable: true
        }))
      }), 2000);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, transition_type: transitionType, account_ids: accountIds })
  });
  return response.json();
}

export async function executeActions(sessionId, accountIds) {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ status: 'started', jobs: accountIds.length }), 1000);
    });
  }

  const response = await fetch(`${API_BASE_URL}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, account_ids: accountIds })
  });
  return response.json();
}

export async function getStatus(sessionId) {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        status: 'in_progress',
        completed: 1,
        total: 2,
        results: {
          '1': { status: 'success' },
          '2': { status: 'in_progress' }
        }
      }), 500);
    });
  }

  const response = await fetch(`${API_BASE_URL}/status/${sessionId}`);
  return response.json();
}
