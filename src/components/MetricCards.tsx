import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { TimeRange } from '../types';

interface MetricCardsProps {
  currentMrr: number;
  totalArr: number;
  totalCustomers: number;
  timeRange: TimeRange;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  currentMrr,
  totalArr,
  totalCustomers,
  timeRange,
}) => {
  // Format helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatMillions = (val: number) => {
    return `$${(val / 1000000).toFixed(2)}M`;
  };

  const arpu = totalCustomers > 0 ? Math.round(currentMrr / totalCustomers) : 0;

  const metrics = [
    {
      id: 'metric-mrr',
      label: 'Monthly Recurring Revenue',
      value: formatCurrency(currentMrr),
      change: '+12.4%',
      period: 'vs last month',
      icon: DollarSign,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'metric-arr',
      label: 'Annual Run Rate',
      value: formatMillions(totalArr),
      change: '+14.8%',
      period: 'projected yearly',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'metric-customers',
      label: 'Active Customers',
      value: totalCustomers.toString(),
      change: '+6 this period',
      period: 'net growth',
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'metric-arpu',
      label: 'Avg. Revenue Per User',
      value: formatCurrency(arpu),
      change: '+4.2%',
      period: 'expansion trend',
      icon: CreditCard,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            id={m.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 tracking-tight">
                {m.label}
              </span>
              <div className={`p-2 rounded-lg ${m.iconBg}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {m.value}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                {m.change}
              </span>
              <span className="text-slate-400 text-[11px]">{m.period}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
