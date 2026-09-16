import React, { useState, useMemo } from 'react';
import { Customer, CustomerStatus } from '../types';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  ChevronRight,
  UserCheck,
  Building
} from 'lucide-react';

interface CustomersTableProps {
  customers: Customer[];
  searchQuery: string;
  onSelectCustomer: (customer: Customer) => void;
  onOpenNewCustomer: () => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  searchQuery,
  onSelectCustomer,
  onOpenNewCustomer,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.plan.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || c.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'trialing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            Trialing
          </span>
        );
      case 'past_due':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Past Due
          </span>
        );
      case 'churned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Churned
          </span>
        );
    }
  };

  const getPlanBadge = (plan: string) => {
    if (plan === 'Enterprise') {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
          Enterprise
        </span>
      );
    }
    if (plan === 'Growth') {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
          Growth
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        {plan}
      </span>
    );
  };

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'trialing', label: 'Trialing' },
    { id: 'past_due', label: 'Past Due' },
  ];

  return (
    <div id="customers-table-card" className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      
      {/* Header & Tabs */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Customers & Subscriptions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filtered.length} of {customers.length} total customer accounts
            </p>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60 text-xs">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewCustomer}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5">Customer</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">MRR</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <Building className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">No customers found</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms</p>
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectCustomer(c)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  {/* Customer */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center">
                        {c.logo || c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-400 font-normal">
                          {c.domain}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getPlanBadge(c.plan)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(c.status)}
                  </td>

                  {/* MRR */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-900">
                    ${c.mrr.toLocaleString()}
                    <span className="text-slate-400 font-normal text-xs">/mo</span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                    {c.joinedDate || '2025-01-15'}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCustomer(c);
                      }}
                      className="text-xs font-medium text-slate-500 group-hover:text-indigo-600 inline-flex items-center gap-1 transition-colors"
                    >
                      <span>View</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
