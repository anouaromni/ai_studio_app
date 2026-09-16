export type TimeRange = '7d' | '30d' | '90d' | '1y';

export type CustomerStatus = 'active' | 'trialing' | 'past_due' | 'churned';
export type PlanTier = 'Enterprise' | 'Growth' | 'Team' | 'Custom Cloud';

export interface Customer {
  id: string;
  name: string;
  domain: string;
  logo: string;
  plan: PlanTier;
  status: CustomerStatus;
  mrr: number;
  seats: number;
  seatsMax: number;
  apiCallsMonthly: string;
  apiLimitPercent: number;
  renewalDate: string;
  healthScore: number; // 0 - 100
  region: string;
  billingEmail: string;
  joinedDate: string;
  tags: string[];
  invoices: Invoice[];
  recentLogs: AuditLog[];
}

export interface Invoice {
  id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  actor: string;
  ipAddress: string;
}

export interface RevenuePoint {
  date: string;
  mrr: number;
  newBookings: number;
  churn: number;
  expansion: number;
  volume: number;
}

export interface PlatformMetric {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  change: string;
  isPositive: boolean;
  benchmark: string;
  subLabel?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'upgrade' | 'payment' | 'signup' | 'incident' | 'expansion' | 'downgrade';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  customerName?: string;
}

export interface InfraNode {
  id: string;
  region: string;
  code: string;
  latencyMs: number;
  reqPerSec: number;
  status: 'optimal' | 'degraded' | 'maintenance';
  uptimePercent: number;
  loadPercent: number;
}
