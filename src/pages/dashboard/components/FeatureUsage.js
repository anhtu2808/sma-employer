import React from 'react';
import Loading from '@/components/Loading';
import SectionHeader from './SectionHeader';

const QuotaItem = ({ label, used, total, renewDate }) => {
  const pct = total > 0 ? Math.min(Math.round((used / total) * 100), 100) : 0;
  const isHigh = pct >= 80;
  const barColor = isHigh ? 'bg-red-500' : 'bg-primary';
  const barBg = isHigh ? 'bg-red-50 dark:bg-red-900/20' : 'bg-orange-50 dark:bg-primary/10';

  return (
    <div className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate mr-3">{label}</span>
        <span className={`text-xs font-bold ${isHigh ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {used}/{total}
        </span>
      </div>
      <div className={`w-full h-2 rounded-full ${barBg} overflow-hidden`}>
        <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      {renewDate && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
          Renews {new Date(renewDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

const FeatureUsage = ({ isLoading, quotas }) => (
  <div className="lg:col-span-1 bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
    <SectionHeader title="Feature Usage" linkTo="/usage" linkLabel="Details" />
    {isLoading ? (
      <Loading className="py-8" />
    ) : quotas.length === 0 ? (
      <div className="text-center py-8">
        <span className="material-icons-outlined text-gray-300 dark:text-gray-600 text-4xl">data_usage</span>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">No quota data available</p>
      </div>
    ) : (
      <div>
        {quotas.map(q => (
          <QuotaItem key={q.key} label={q.label} used={q.used} total={q.total} renewDate={q.renewDate} />
        ))}
      </div>
    )}
  </div>
);

export default FeatureUsage;
