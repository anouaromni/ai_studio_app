import React from 'react';
import { Customer } from '../types';

interface PlanDistributionProps {
  customers: Customer[];
}

export const PlanDistribution: React.FC<PlanDistributionProps> = ({ customers }) => {
  const tiers = [
    { name: 'Enterprise', color: 'bg-purple-600', textColor: 'text-purple-700', bgLight: 'bg-purple-50' },
    { name: 'Growth', color: 'bg-indigo-600', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50' },
    { name: 'Team', color: 'bg-blue-600', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
  ];

  const totalMrr = customers.reduce((sum, c) => (c.status !== 'churned' ? sum + c.mrr : sum), 0) || 1;

  const stats = tiers.map((t) => {
    const tierCustomers = customers.filter((c) => c.plan === t.name && c.status !== 'churned');
    const count = tierCustomers.length;
    const mrr = tierCustomers.reduce((sum, c) => sum + c.mrr, 0);
    const percent = Math.round((mrr / totalMrr) * 100);

    return {
      ...t,
      count,
      mrr,
      percent,
    };
  });

  return (
    <div id="plan-distribution-card" className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Plan Breakdown</h3>
        <span className="text-xs text-slate-400">By Revenue</span>
      </div>

      <div className="mt-4 space-y-4">
        {stats.map((tier) => (
          <div key={tier.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${tier.color}`} />
                <span className="font-medium text-slate-800">{tier.name}</span>
                <span className="text-slate-400">({tier.count} accounts)</span>
              </div>
              <div className="font-semibold text-slate-900">
                ${(tier.mrr / 1000).toFixed(0)}k/mo <span className="font-normal text-slate-400">({tier.percent}%)</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${tier.color} transition-all duration-500`}
                style={{ width: `${tier.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total Active MRR</span>
        <strong className="text-slate-900 font-semibold">${(totalMrr / 1000).toFixed(1)}k</strong>
      </div>
    </div>
  );
};
