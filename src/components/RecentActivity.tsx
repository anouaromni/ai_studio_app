import React from 'react';
import { ActivityEvent } from '../types';
import { CheckCircle2, ArrowUpRight, UserPlus, CreditCard } from 'lucide-react';

interface RecentActivityProps {
  events: ActivityEvent[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ events }) => {
  const displayEvents = events.slice(0, 5);

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'payment':
        return (
          <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CreditCard className="h-3.5 w-3.5" />
          </div>
        );
      case 'upgrade':
      case 'expansion':
        return (
          <div className="h-7 w-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        );
      case 'signup':
      default:
        return (
          <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UserPlus className="h-3.5 w-3.5" />
          </div>
        );
    }
  };

  return (
    <div id="recent-activity-card" className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
        <span className="text-xs text-slate-400">Latest updates</span>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {displayEvents.map((evt) => (
          <div key={evt.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
            {getEventIcon(evt.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {evt.title}
                </p>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {evt.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {evt.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
