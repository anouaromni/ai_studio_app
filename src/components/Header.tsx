import React from 'react';
import { 
  BarChart3, 
  Search, 
  Plus, 
  Download,
  Building2,
  Check
} from 'lucide-react';
import { TimeRange } from '../types';

interface HeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewCustomer: () => void;
  onExportData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  timeRange,
  onTimeRangeChange,
  searchQuery,
  onSearchChange,
  onOpenNewCustomer,
  onExportData,
}) => {
  const timeRanges: { id: TimeRange; label: string }[] = [
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' },
    { id: '90d', label: '90D' },
    { id: '1y', label: '1Y' },
  ];

  return (
    <header id="dashboard-header" className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-base tracking-tight">
                Omni SaaS
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Overview
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Customers */}
        <div className="hidden md:flex flex-1 max-w-xs items-center relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="header-search-input"
            type="text"
            placeholder="Search customers or plans..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Right: Time Range filter & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            {timeRanges.map((tr) => {
              const active = timeRange === tr.id;
              return (
                <button
                  key={tr.id}
                  id={`time-range-btn-${tr.id}`}
                  onClick={() => onTimeRangeChange(tr.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    active
                      ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tr.label}
                </button>
              );
            })}
          </div>

          {/* Export CSV Button */}
          <button
            id="export-csv-button"
            onClick={onExportData}
            title="Export CSV"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* Add Customer Button */}
          <button
            id="add-customer-header-btn"
            onClick={onOpenNewCustomer}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center pl-1 sm:pl-2 border-l border-slate-200">
            <div 
              title="anouar@omni.co"
              className="h-8 w-8 rounded-full bg-slate-800 text-white text-xs font-semibold flex items-center justify-center cursor-pointer shadow-xs hover:ring-2 hover:ring-indigo-400 transition-all"
            >
              AO
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
