import React, { useState } from 'react';
import { Customer, PlanTier } from '../types';
import { X, Building2, Plus } from 'lucide-react';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Customer) => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [plan, setPlan] = useState<PlanTier>('Growth');
  const [mrr, setMrr] = useState<number>(4500);
  const [status, setStatus] = useState<'active' | 'trialing'>('active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) return;

    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'CU';

    const newCustomer: Customer = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      domain: domain.trim(),
      logo: initials,
      plan,
      status,
      mrr: Number(mrr) || 1000,
      seats: 25,
      seatsMax: 50,
      apiCallsMonthly: '2.5M',
      apiLimitPercent: 40,
      renewalDate: '2027-09-01',
      healthScore: 95,
      region: 'us-east-1',
      billingEmail: `billing@${domain.trim()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      tags: ['New Customer'],
      invoices: [
        {
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: Number(mrr) || 1000,
          date: new Date().toISOString().split('T')[0],
          status: 'paid',
        },
      ],
      recentLogs: [
        {
          id: 'log-1',
          action: 'Account created via Dashboard',
          timestamp: 'Just now',
          actor: 'anouar@omni.co',
          ipAddress: '127.0.0.1',
        },
      ],
    };

    onAddCustomer(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="new-customer-dialog"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Add Customer</h2>
              <p className="text-xs text-slate-500">Create a new subscription record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Corporation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Domain / Website <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. acmecorp.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plan Tier
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as PlanTier)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Growth">Growth</option>
                <option value="Team">Team</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'trialing')}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monthly Recurring Revenue ($ USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                $
              </span>
              <input
                type="number"
                min="100"
                step="50"
                value={mrr}
                onChange={(e) => setMrr(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Customer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
