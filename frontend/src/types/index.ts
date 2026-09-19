export interface Account {
  account_id: string;
  service_name: string;
  category: string;
  billing_status: 'active_recurring' | 'free' | 'unknown';
  last_activity_date: string;
  linked_email: string;
  shared_with: string | null;
  status: string;
  classification?: string;
  confidence?: string;
  reason?: string;
  auto_actionable?: boolean;
  next_step?: string;
}

export type TransitionType = 'moving_abroad' | 'new_job' | 'breakup' | 'retirement' | 'family_affairs' | 'decluttering';
export type Classification = 'KEEP' | 'TRANSFER' | 'CANCEL' | 'CLOSE_OR_MEMORIALIZE' | 'MIGRATE';
