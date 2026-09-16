import React from 'react';
import { Customer, CustomerStatus, PlanTier } from '../types';
import { X, Building2, Calendar, Mail, DollarSign, Trash2, CheckCircle2 } from 'lucide-react';

interface CustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
  onUpdateCustomer: (updated: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  customer,
  onClose,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  if (!customer) return null;

  const handleStatusChange = (newStatus: CustomerStatus) => {
    onUpdateCustomer({
      ...customer,
      status: newStatus,
    });
  };

  const handlePlanChange = (newPlan: PlanTier) => {
    onUpdateCustomer({
      ...customer,
      plan: newPlan,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="customer-detail-modal"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center">
              {customer.logo || customer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{customer.name}</h2>
              <a
                href={`https://${customer.domain}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline"
              >
                {customer.domain}
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-4 text-sm">
          
          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase">Monthly Revenue</span>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                ${customer.mrr.toLocaleString()}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase">Current Plan</span>
              <div className="text-base font-semibold text-slate-900 mt-0.5">
                {customer.plan}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase">Status</span>
              <div className="mt-1">
                <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {customer.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Edit Controls */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Change Status
              </label>
              <select
                value={customer.status}
                onChange={(e) => handleStatusChange(e.target.value as CustomerStatus)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="past_due">Past Due</option>
                <option value="churned">Churned</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Change Plan
              </label>
              <select
                value={customer.plan}
                onChange={(e) => handlePlanChange(e.target.value as PlanTier)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Growth">Growth</option>
                <option value="Team">Team</option>
              </select>
            </div>
          </div>

          {/* Details metadata */}
          <div className="pt-2 space-y-2 text-xs text-slate-600 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Mail className="h-3.5 w-3.5" /> Billing Email:
              </span>
              <span className="font-medium text-slate-800">{customer.billingEmail || `billing@${customer.domain}`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="h-3.5 w-3.5" /> Customer Since:
              </span>
              <span className="font-medium text-slate-800">{customer.joinedDate || '2025-01-14'}</span>
            </div>
          </div>

          {/* Invoices */}
          {customer.invoices && customer.invoices.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                Recent Invoices
              </span>
              <div className="space-y-1.5">
                {customer.invoices.slice(0, 2).map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <span className="font-mono text-slate-600">{inv.id}</span>
                    <span className="text-slate-500">{inv.date}</span>
                    <span className="font-semibold text-slate-900">${inv.amount.toLocaleString()}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`Remove ${customer.name} from customer list?`)) {
                onDeleteCustomer(customer.id);
                onClose();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
