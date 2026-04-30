import React from 'react';
import { useGetJobsQuery } from '@/apis/jobApi';
import { useGetApplicationsQuery, useGetApplicationStatusSummaryQuery } from '@/apis/applicationApi';
import { useGetFeatureUsageQuery } from '@/apis/featureUsageApi';

import ActionChips from './components/ActionChips';
import JobsAttention from './components/JobsAttention';
import QuotaAlert from './components/QuotaAlert';
import ApplicationPipeline from './components/ApplicationPipeline';
import JobPerformance from './components/JobPerformance';

const Dashboard = () => {
  const { data: jobsData, isLoading: isJobsLoading } = useGetJobsQuery({ page: 0, size: 20, status: 'PUBLISHED' });
  const { data: statusSummaryData, isLoading: isSummaryLoading } = useGetApplicationStatusSummaryQuery();
  const { data: appsData, isLoading: isAppsLoading } = useGetApplicationsQuery({ page: 0, size: 20 });
  const { data: featureUsage = [] } = useGetFeatureUsageQuery();

  const jobs = jobsData?.data?.content || [];
  const statusSummary = statusSummaryData?.data;
  const applications = appsData?.data?.content || [];

  const quotas = Array.isArray(featureUsage)
    ? featureUsage
        .filter(q => q?.usageType !== 'BOOLEAN' && q?.maxQuota != null)
        .map(q => ({
          key: q.featureKey || String(q.featureId ?? ''),
          label: q.featureName || q.featureKey || 'Quota',
          used: Number(q.used ?? 0),
          total: Number(q.maxQuota ?? 0),
        }))
        .filter(q => q.key)
    : [];

  return (
    <div className="space-y-6">
      {/* Action Chips - pending work counts */}
      <ActionChips
        statusSummary={statusSummary}
        jobs={jobs}
        isLoading={isSummaryLoading || isJobsLoading}
      />

      {/* Jobs Needing Attention */}
      <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Jobs Needing Attention</h3>
        </div>
        <JobsAttention jobs={jobs} isLoading={isJobsLoading} />
      </div>

      {/* Quota Alert - only shown when quotas > 80% */}
      <QuotaAlert quotas={quotas} />

      {/* Application Pipeline */}
      <div className="w-full">
        <ApplicationPipeline statusSummary={statusSummary} isLoading={isSummaryLoading} />
      </div>

      {/* Job Performance Table */}
      <JobPerformance jobs={jobs} isLoading={isJobsLoading} />
    </div>
  );
};

export default Dashboard;
