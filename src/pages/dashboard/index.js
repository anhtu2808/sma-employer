import React from 'react';
import { useGetMyRecruiterInfoQuery } from '@/apis/recruiterApi';
import { useGetMyJobStatusCountQuery, useGetJobsQuery } from '@/apis/jobApi';
import { useGetApplicationsQuery } from '@/apis/applicationApi';
import { useGetFeatureUsageQuery } from '@/apis/featureUsageApi';
import { useGetNotificationsQuery } from '@/apis/notificationApi';
import { useGetCompanyProfileQuery } from '@/apis/companyApi';

import UserProfileCard from './components/UserProfileCard';
import StatsCard from './components/StatsCard';
import JobPipeline from './components/JobPipeline';
import FeatureUsage from './components/FeatureUsage';
import RecentApplications from './components/RecentApplications';
import RecentNotifications from './components/RecentNotifications';
import RecentJobs from './components/RecentJobs';

const Dashboard = () => {
  // ── API Queries ──
  const { data: myInfoData, isLoading: isInfoLoading } = useGetMyRecruiterInfoQuery();
  const { data: jobStatusData, isLoading: isJobStatusLoading } = useGetMyJobStatusCountQuery();
  const { data: appsData, isLoading: isAppsLoading } = useGetApplicationsQuery({ page: 0, size: 5 });
  const { data: featureUsage = [], isLoading: isQuotaLoading } = useGetFeatureUsageQuery();
  const { data: notiData, isLoading: isNotiLoading } = useGetNotificationsQuery({ page: 0, size: 5 });
  const { data: recentJobsData, isLoading: isRecentJobsLoading } = useGetJobsQuery({ page: 0, size: 5 });
  const { data: companyData } = useGetCompanyProfileQuery();

  // ── Derived Data ──
  const recruiterInfo = myInfoData?.data;
  const recruiterName = recruiterInfo?.fullName || recruiterInfo?.email?.split('@')[0] || 'there';
  const recruiterEmail = recruiterInfo?.email || '';
  const recruiterAvatar = recruiterInfo?.avatar || recruiterInfo?.avatarUrl || null;
  const companyLocation = companyData?.data?.country || companyData?.data?.locations?.[0]?.city || '';
  const joinDate = recruiterInfo?.createdAt || recruiterInfo?.joinedAt || null;

  const jobSummary = jobStatusData?.data;
  const totalJobs = Number(jobSummary?.all || 0);
  const getCountByStatus = (status) => {
    const found = (jobSummary?.statuses || []).find(s => s.status === status);
    return Number(found?.count || 0);
  };

  const applications = appsData?.data?.content || [];
  const totalApplications = appsData?.data?.totalElements || 0;
  const notifications = notiData?.data?.content || [];
  const recentJobs = recentJobsData?.data?.content || [];

  const quotas = Array.isArray(featureUsage)
    ? featureUsage
      .filter(q => q?.usageType !== 'BOOLEAN' && q?.maxQuota != null)
      .map(q => ({
        key: q.featureKey || String(q.featureId ?? ''),
        label: q.featureName || q.featureKey || 'Quota',
        used: Number(q.used ?? 0),
        total: Number(q.maxQuota ?? 0),
        renewDate: q.renewDate,
      }))
      .filter(q => q.key)
    : [];

  const isStatsLoading = isJobStatusLoading || isAppsLoading;

  return (
    <>
      {/* User Profile */}
      <UserProfileCard
        isLoading={isInfoLoading}
        recruiterName={recruiterName}
        recruiterEmail={recruiterEmail}
        recruiterAvatar={recruiterAvatar}
        companyLocation={companyLocation}
        joinDate={joinDate}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatsCard
          icon="work"
          iconBg="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
          label="Active Jobs"
          value={getCountByStatus('PUBLISHED')}
          linkTo="/jobs?tab=PUBLISHED"
          isLoading={isStatsLoading}
        />
        <StatsCard
          icon="description"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
          label="Total Applications"
          value={totalApplications}
          linkTo="/applications"
          isLoading={isStatsLoading}
        />
        <StatsCard
          icon="pending_actions"
          iconBg="bg-yellow-50 dark:bg-yellow-900/20"
          iconColor="text-yellow-600 dark:text-yellow-400"
          label="Pending Review"
          value={getCountByStatus('PENDING_REVIEW')}
          linkTo="/jobs?tab=PENDING_REVIEW"
          isLoading={isStatsLoading}
        />
        <StatsCard
          icon="drafts"
          iconBg="bg-gray-100 dark:bg-gray-800"
          iconColor="text-gray-600 dark:text-gray-400"
          label="Draft Jobs"
          value={getCountByStatus('DRAFT')}
          linkTo="/jobs?tab=DRAFT"
          isLoading={isStatsLoading}
        />
      </div>

      {/* Job Pipeline & Feature Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
        <JobPipeline
          isLoading={isJobStatusLoading}
          totalJobs={totalJobs}
          getCountByStatus={getCountByStatus}
        />
        <FeatureUsage isLoading={isQuotaLoading} quotas={quotas} />
      </div>

      {/* Recent Applications & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
        <RecentApplications isLoading={isAppsLoading} applications={applications} />
        <RecentNotifications isLoading={isNotiLoading} notifications={notifications} />
      </div>

      {/* Recent Jobs */}
      <RecentJobs isLoading={isRecentJobsLoading} recentJobs={recentJobs} />
    </>
  );
};

export default Dashboard;
