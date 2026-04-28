import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '../../../utils/icons';

const QuotaAlert = ({ quotas }) => {
  const nearLimitQuotas = useMemo(() => {
    if (!quotas || !Array.isArray(quotas)) return [];
    return quotas.filter(q => q.total > 0 && q.used / q.total >= 0.8);
  }, [quotas]);

  if (nearLimitQuotas.length === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
      <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 dark:text-amber-400 text-xl flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {nearLimitQuotas.map(q => {
            const pct = Math.round((q.used / q.total) * 100);
            const isCritical = pct >= 95;
            return (
              <span
                key={q.key}
                className={`font-medium ${isCritical ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-300'}`}
              >
                {q.label}: {q.used}/{q.total} ({pct}%)
              </span>
            );
          })}
        </div>
      </div>
      <Link
        to="/billing-plans"
        className="text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 whitespace-nowrap flex-shrink-0"
      >
        Upgrade
      </Link>
    </div>
  );
};

export default QuotaAlert;
