const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USE_MOCK = true;

const generateId = () => Math.random().toString(36).substr(2, 9);

// Rich 18-account mock dataset covering all 5 classification types
const MOCK_ACCOUNTS = [
  {
    account_id: 'acc_netflix01',
    service_name: 'Netflix',
    category: 'streaming',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-15',
    linked_email: 'user@example.com',
    shared_with: 'family plan',
    status: 'DETECTED',
  },
  {
    account_id: 'acc_spotify02',
    service_name: 'Spotify',
    category: 'music',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-10',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_prime03',
    service_name: 'Amazon Prime',
    category: 'ecommerce',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-12',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_github04',
    service_name: 'GitHub Copilot',
    category: 'developer_tools',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-18',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_cultfit05',
    service_name: 'Cult.fit',
    category: 'health_fitness',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-08',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_zomato06',
    service_name: 'Zomato Pro',
    category: 'food_delivery',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-14',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_adobe07',
    service_name: 'Adobe Creative Cloud',
    category: 'design_software',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-16',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_linkedin08',
    service_name: 'LinkedIn Premium',
    category: 'professional',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-11',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_hdfc09',
    service_name: 'HDFC Bank',
    category: 'banking',
    billing_status: 'free',
    last_activity_date: '2026-09-17',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_jio10',
    service_name: 'Jio Fiber',
    category: 'internet',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-01',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_google11',
    service_name: 'Google One',
    category: 'cloud_storage',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-09',
    linked_email: 'user@example.com',
    shared_with: 'family',
    status: 'DETECTED',
  },
  {
    account_id: 'acc_zerodha12',
    service_name: 'Zerodha',
    category: 'investments',
    billing_status: 'free',
    last_activity_date: '2026-09-13',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_airtel13',
    service_name: 'Airtel Postpaid',
    category: 'telecom',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-06',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_swiggy14',
    service_name: 'Swiggy One',
    category: 'food_delivery',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-15',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_tatasky15',
    service_name: 'Tata Play',
    category: 'dth',
    billing_status: 'active_recurring',
    last_activity_date: '2026-09-03',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_uber16',
    service_name: 'Uber',
    category: 'transport',
    billing_status: 'unknown',
    last_activity_date: '2026-09-17',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_mmt17',
    service_name: 'MakeMyTrip',
    category: 'travel',
    billing_status: 'free',
    last_activity_date: '2026-08-20',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
  {
    account_id: 'acc_ola18',
    service_name: 'Ola',
    category: 'transport',
    billing_status: 'free',
    last_activity_date: '2026-09-05',
    linked_email: 'user@example.com',
    shared_with: null,
    status: 'DETECTED',
  },
];

// Classification results with all 5 types represented
const MOCK_CLASSIFICATIONS = [
  { account_id: 'acc_netflix01', classification: 'CANCEL', confidence: 'high', reason: 'Streaming service is geo-locked; most content unavailable after relocation. Cancel before move to avoid continued billing.', auto_actionable: true, next_step: 'Cancel via netflix.com/cancelplan before your move date', status: 'CLASSIFIED' },
  { account_id: 'acc_spotify02', classification: 'KEEP', confidence: 'high', reason: 'Spotify Premium is globally available and supports offline listening — ideal for transition periods.', auto_actionable: false, next_step: 'Update payment method to international card', status: 'CLASSIFIED' },
  { account_id: 'acc_prime03', classification: 'CANCEL', confidence: 'high', reason: 'Amazon Prime India benefits (free delivery, Prime Video India) will not apply abroad. Cancel and re-subscribe locally.', auto_actionable: true, next_step: 'Cancel at amazon.in/gp/primecentral before departure', status: 'CLASSIFIED' },
  { account_id: 'acc_github04', classification: 'KEEP', confidence: 'high', reason: 'GitHub Copilot is cloud-based and works globally with no geo-restrictions. Continue subscription.', auto_actionable: false, next_step: 'No action needed — service continues globally', status: 'CLASSIFIED' },
  { account_id: 'acc_cultfit05', classification: 'CANCEL', confidence: 'high', reason: 'Physical gym membership cannot be used after relocation. Cancel to avoid recurring charges.', auto_actionable: true, next_step: 'Cancel via cult.fit app under subscriptions', status: 'CLASSIFIED' },
  { account_id: 'acc_zomato06', classification: 'CANCEL', confidence: 'high', reason: 'Zomato Pro only covers Indian cities. Service will be unusable post-relocation.', auto_actionable: true, next_step: 'Cancel via Zomato app > Pro membership > Cancel Plan', status: 'CLASSIFIED' },
  { account_id: 'acc_adobe07', classification: 'MIGRATE', confidence: 'medium', reason: 'Adobe CC is available globally but your plan may be region-priced. Consider migrating to an international plan to save costs.', auto_actionable: false, next_step: 'Contact Adobe support to migrate to global pricing plan', status: 'CLASSIFIED' },
  { account_id: 'acc_linkedin08', classification: 'KEEP', confidence: 'high', reason: 'LinkedIn Premium is globally accessible and especially valuable when building a new professional network abroad.', auto_actionable: false, next_step: 'Update billing currency after relocation for better rates', status: 'CLASSIFIED' },
  { account_id: 'acc_hdfc09', classification: 'TRANSFER', confidence: 'medium', reason: 'Bank account should be converted to NRI account (NRO/NRE) before departure to maintain compliance.', auto_actionable: false, next_step: 'Visit HDFC branch or use netbanking to apply for NRI account conversion', status: 'CLASSIFIED' },
  { account_id: 'acc_jio10', classification: 'CANCEL', confidence: 'high', reason: 'Fixed-line internet will be unused post-relocation. Cancel with 30-day notice to avoid penalty.', auto_actionable: false, next_step: 'Call Jio helpline (198) and raise a termination request 30 days ahead', status: 'CLASSIFIED' },
  { account_id: 'acc_google11', classification: 'KEEP', confidence: 'high', reason: 'Google One storage is global and family sharing remains active. No action needed.', auto_actionable: false, next_step: 'No action needed — works globally', status: 'CLASSIFIED' },
  { account_id: 'acc_zerodha12', classification: 'CLOSE_OR_MEMORIALIZE', confidence: 'medium', reason: 'NRIs cannot actively trade on Zerodha under FEMA regulations. Account should be frozen or closed post-departure.', auto_actionable: false, next_step: 'Contact Zerodha support to freeze or close trading account per FEMA guidelines', status: 'CLASSIFIED' },
  { account_id: 'acc_airtel13', classification: 'CANCEL', confidence: 'high', reason: 'Postpaid mobile plan will be unused post-departure. Port out or cancel before leaving.', auto_actionable: true, next_step: 'Request number portability or cancel at airtel store', status: 'CLASSIFIED' },
  { account_id: 'acc_swiggy14', classification: 'CANCEL', confidence: 'high', reason: 'Swiggy One membership is India-only and will provide zero value after moving abroad.', auto_actionable: true, next_step: 'Cancel via Swiggy app > Swiggy One > Manage Membership', status: 'CLASSIFIED' },
  { account_id: 'acc_tatasky15', classification: 'CANCEL', confidence: 'high', reason: 'DTH service requires a fixed address and dish installation. Cannot be used abroad.', auto_actionable: false, next_step: 'Call Tata Play customer care (18002086633) to request disconnection', status: 'CLASSIFIED' },
  { account_id: 'acc_uber16', classification: 'KEEP', confidence: 'medium', reason: 'Uber operates globally. Your account, history, and payment methods carry over seamlessly.', auto_actionable: false, next_step: 'Add international payment method; local rides will work automatically', status: 'CLASSIFIED' },
  { account_id: 'acc_mmt17', classification: 'CLOSE_OR_MEMORIALIZE', confidence: 'low', reason: 'MakeMyTrip primarily covers India travel. Low activity suggests this can be closed to reduce digital footprint.', auto_actionable: false, next_step: 'Optionally close account via MakeMyTrip settings > Account > Delete Account', status: 'CLASSIFIED' },
  { account_id: 'acc_ola18', classification: 'CANCEL', confidence: 'high', reason: 'Ola is an India-only service. Removing app and account reduces digital footprint post-relocation.', auto_actionable: false, next_step: 'Delete account via Ola app > Help > Account > Delete Account', status: 'CLASSIFIED' },
];

export async function scanInbox(sessionId, inboxData) {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        session_id: sessionId || generateId(),
        accounts: MOCK_ACCOUNTS,
      }), 1800);
    });
  }

  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, inbox_data: inboxData }),
  });
  return response.json();
}

export async function classifyAccounts(sessionId, transitionType, accountIds) {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        session_id: sessionId,
        results: MOCK_CLASSIFICATIONS.filter(c => accountIds.includes(c.account_id)),
      }), 2200);
    });
  }

  const response = await fetch(`${API_BASE_URL}/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, transition_type: transitionType, account_ids: accountIds }),
  });
  return response.json();
}

export async function executeActions(sessionId, accountIds) {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        session_id: sessionId,
        executions: accountIds.map(id => ({
          account_id: id,
          execution_id: 'exec_' + generateId(),
          status: 'EXECUTING',
        })),
      }), 1000);
    });
  }

  const response = await fetch(`${API_BASE_URL}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, account_ids: accountIds }),
  });
  return response.json();
}

// Simulated progressive status for the mock — cycles accounts through EXECUTING -> CANCELLED
let _pollCount = 0;
export async function getStatus(sessionId) {
  if (USE_MOCK) {
    _pollCount++;
    return new Promise(resolve => {
      const autoIds = MOCK_CLASSIFICATIONS.filter(c => c.auto_actionable && c.classification === 'CANCEL').map(c => c.account_id);
      const cancelled = autoIds.slice(0, Math.min(_pollCount * 2, autoIds.length));
      const executing = autoIds.slice(cancelled.length, Math.min(cancelled.length + 2, autoIds.length));

      const accounts = MOCK_ACCOUNTS.map(acc => {
        const cls = MOCK_CLASSIFICATIONS.find(c => c.account_id === acc.account_id);
        let status = cls?.status || 'DETECTED';
        if (cancelled.includes(acc.account_id)) status = 'CANCELLED';
        else if (executing.includes(acc.account_id)) status = 'EXECUTING';
        else if (cls?.auto_actionable && cls?.classification === 'CANCEL') status = 'EXECUTING';
        return {
          ...acc,
          ...(cls || {}),
          status,
        };
      });

      setTimeout(() => resolve({
        session_id: sessionId,
        accounts,
      }), 400);
    });
  }

  const response = await fetch(`${API_BASE_URL}/status/${sessionId}`);
  return response.json();
}
