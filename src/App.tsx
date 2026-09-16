import React, { useState, useMemo } from 'react';
import { TimeRange, Customer, ActivityEvent } from './types';
import { REVENUE_DATA, INITIAL_CUSTOMERS, INITIAL_EVENTS } from './data/mockData';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { RevenueChart } from './components/RevenueChart';
import { CustomersTable } from './components/CustomersTable';
import { PlanDistribution } from './components/PlanDistribution';
import { RecentActivity } from './components/RecentActivity';
import { NewCustomerModal } from './components/NewCustomerModal';
import { CustomerModal } from './components/CustomerModal';

export default function App() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [events, setEvents] = useState<ActivityEvent[]>(INITIAL_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

  // Compute live rollups
  const currentTotalMrr = useMemo(() => {
    return customers.reduce((acc, c) => (c.status === 'churned' ? acc : acc + c.mrr), 0);
  }, [customers]);

  const totalArr = useMemo(() => {
    return currentTotalMrr * 12;
  }, [currentTotalMrr]);

  const activeCustomerCount = useMemo(() => {
    return customers.filter((c) => c.status !== 'churned').length;
  }, [customers]);

  // Customer handlers
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    // Also record event
    const newEvt: ActivityEvent = {
      id: `evt-${Date.now()}`,
      type: 'signup',
      title: 'New Customer Added',
      description: `${newCustomer.name} subscribed to ${newCustomer.plan} ($${newCustomer.mrr.toLocaleString()}/mo)`,
      timestamp: 'Just now',
      amount: newCustomer.mrr,
      customerName: newCustomer.name,
    };
    setEvents((prev) => [newEvt, ...prev]);
  };

  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setSelectedCustomer(updated);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // CSV Export utility
  const handleExportCsv = () => {
    const headers = ['Name', 'Domain', 'Plan', 'Status', 'MRR', 'Joined'];
    const rows = customers.map((c) => [
      `"${c.name}"`,
      c.domain,
      c.plan,
      c.status,
      c.mrr,
      c.joinedDate || '2025-01-15',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saas_customers_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-700">
      
      {/* 1. Clean Top Navigation Header */}
      <Header
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
        onExportData={handleExportCsv}
      />

      {/* 2. Main Dashboard Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards Row */}
        <MetricCards
          currentMrr={currentTotalMrr}
          totalArr={totalArr}
          totalCustomers={activeCustomerCount}
          timeRange={timeRange}
        />

        {/* Primary Revenue Growth Chart */}
        <RevenueChart
          data={REVENUE_DATA[timeRange]}
          timeRange={timeRange}
        />

        {/* Two-Column Section: Customers Table (2/3) & Insights Sidebar (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Customers List */}
          <div className="lg:col-span-2">
            <CustomersTable
              customers={customers}
              searchQuery={searchQuery}
              onSelectCustomer={setSelectedCustomer}
              onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
            />
          </div>

          {/* Right Sidebar: Plan Distribution & Recent Activity */}
          <div className="lg:col-span-1 space-y-6">
            <PlanDistribution customers={customers} />
            <RecentActivity events={events} />
          </div>

        </div>

      </main>

      {/* 3. Clean, Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Omni SaaS Dashboard &bull; All systems operational</span>
          <span>Logged in as anouar@omni.co</span>
        </div>
      </footer>

      {/* Modals */}
      <NewCustomerModal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onAddCustomer={handleAddCustomer}
      />

      <CustomerModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onUpdateCustomer={handleUpdateCustomer}
        onDeleteCustomer={handleDeleteCustomer}
      />

    </div>
  );
}
