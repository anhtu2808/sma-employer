import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarRegular, faUser } from '../../../utils/icons';

const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
};

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
  if (score >= 60) return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
  if (score >= 40) return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
  return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
};

const getMatchLevel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Low';
};

const CandidateSkeleton = () => (
  <div className="flex items-center gap-3 py-3">
    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </div>
    <div className="w-14 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
  </div>
);

const TopCandidates = ({ applications, isLoading }) => {
  const navigate = useNavigate();

  const topCandidates = useMemo(() => {
    if (!applications) return [];
    return [...applications]
      .filter(app => app.evaluation?.aiScore != null)
      .sort((a, b) => {
        const scoreA = a.evaluation?.aiScore ?? 0;
        const scoreB = b.evaluation?.aiScore ?? 0;
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }, [applications]);

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <SectionHeader title="Top Candidates" linkTo="/applications" />
      {isLoading ? (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[1, 2, 3, 4, 5].map(i => <CandidateSkeleton key={i} />)}
        </div>
      ) : topCandidates.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon icon={faStarRegular} className="text-gray-400 text-2xl" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No evaluated candidates yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {topCandidates.map((app) => {
            const score = app.evaluation?.aiScore ?? 0;
            const scoreColor = getScoreColor(score);
            const matchLevel = getMatchLevel(score);
            const appliedDate = app.appliedAt || app.createdAt;

            return (
              <div
                key={app.applicationId || app.id}
                className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 rounded-lg transition-colors"
                onClick={() => navigate(`/applications/${app.applicationId || app.id}`)}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUser} className="text-lg text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {app.candidateName || app.candidate?.fullName || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {app.candidateEmail || ''}
                    {appliedDate && (
                      <span className="ml-2 text-gray-400">{getRelativeTime(appliedDate)}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 hidden sm:inline">{matchLevel}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${scoreColor}`}>
                    {Math.round(score)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopCandidates;
