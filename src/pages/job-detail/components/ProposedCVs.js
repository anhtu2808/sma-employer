import React, { useEffect, useRef, useState } from 'react';
import { InputNumber } from 'antd';
import {
  useGetProposedCvsQuery,
  useRefreshProposedCvsMutation,
  useRemoveProposedCvMutation,
  useUnlockProposedCvMutation,
} from '../../../apis/jobApi';
import { useGetJobDetailQuery } from '@/apis/apis';
import Loading from '@/components/Loading';
import { ChevronLeft, ChevronRight, ExternalLink, Lock, MapPin, RefreshCw, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faWandMagicSparkles } from '../../../utils/icons';
import toastMessage from '@/utils/toastMessage';

const POLLING_INTERVAL = 5000;
const DEFAULT_MIN_MATCH_RATE = 30;
const MIN_MATCH_RATE = 0;
const MAX_MATCH_RATE = 100;

const ProposedCVs = ({ jobId }) => {
  const navigate = useNavigate();
  const [isJobPolling, setIsJobPolling] = useState(false);
  const [isEvaluationPolling, setIsEvaluationPolling] = useState(false);
  const previousRefreshPendingRef = useRef(false);
  const [minMatchRate, setMinMatchRate] = useState(DEFAULT_MIN_MATCH_RATE);

  const {
    data: jobData,
    refetch: refetchJobDetail,
  } = useGetJobDetailQuery(jobId, {
    skip: !jobId,
    pollingInterval: isJobPolling ? POLLING_INTERVAL : 0,
    refetchOnMountOrArgChange: true,
  });
  const jobStatus = jobData?.data?.status;
  const persistedMinMatchRate = jobData?.data?.proposeRefreshMinMatchRate;
  const isUnpublished = jobStatus === 'DRAFT' || jobStatus === 'PENDING_REVIEW';
  const isRefreshPending = Boolean(jobData?.data?.proposeRefreshPending);

  const [params, setParams] = useState({ page: 0, size: 10 });
  const {
    data: response,
    isLoading,
    isFetching,
    refetch: refetchProposedCvs,
  } = useGetProposedCvsQuery(
    { id: jobId, ...params },
    {
      skip: !jobId || isUnpublished,
      pollingInterval: isRefreshPending || isEvaluationPolling ? POLLING_INTERVAL : 0,
      refetchOnMountOrArgChange: true,
    }
  );
  const [refreshProposedCvs, { isLoading: isRefreshingRequest }] = useRefreshProposedCvsMutation();
  const [unlockProposedCv, { isLoading: isUnlocking }] = useUnlockProposedCvMutation();
  const [removeProposedCv, { isLoading: isRemoving }] = useRemoveProposedCvMutation();
  const data = response?.data || { content: [], totalElements: 0, pageNumber: params.page, pageSize: params.size, totalPages: 0 };
  const applications = data.content;
  const normalizedApplications = applications.map(normalizeProposal);
  const hasEvaluationInProgress = normalizedApplications.some((proposal) => isEvaluationPendingStatus(proposal.evaluationStatus));
  const totalElements = data.totalElements;
  const totalPages = data.totalPages;
  const isBusyRefreshing = isRefreshingRequest || isRefreshPending;
  const isMutatingProposal = isUnlocking || isRemoving;

  useEffect(() => {
    setIsJobPolling(isRefreshPending);
  }, [isRefreshPending]);

  useEffect(() => {
    const wasRefreshPending = previousRefreshPendingRef.current;

    if (wasRefreshPending && !isRefreshPending) {
      refetchProposedCvs();
    }

    previousRefreshPendingRef.current = isRefreshPending;
  }, [isRefreshPending, refetchProposedCvs]);

  useEffect(() => {
    setIsEvaluationPolling(hasEvaluationInProgress);
  }, [hasEvaluationInProgress]);

  useEffect(() => {
    setMinMatchRate(normalizeMinMatchRate(persistedMinMatchRate));
  }, [jobId, persistedMinMatchRate]);

  const handleRefreshProposedCvs = async () => {
    if (!jobId) return;

    if (isRefreshPending) {
      toastMessage.info('Refresh request is already in progress.');
      return;
    }

    try {
      const normalizedMinMatchRate = normalizeMinMatchRate(minMatchRate);
      const result = await refreshProposedCvs({
        id: jobId,
        minMatchRate: normalizedMinMatchRate,
      }).unwrap();
      toastMessage.success(result?.message || 'Refreshing proposed CVs in the background.');
      await refetchJobDetail();
    } catch (error) {
      toastMessage.error(error?.data?.message || 'Failed to refresh proposed CVs');
    }
  };

  const handleUnlockProposal = async (proposal) => {
    if (!proposal?.proposedResumeId) return;

    try {
      await unlockProposedCv(proposal.proposedResumeId).unwrap();
      toastMessage.success('Candidate profile unlocked successfully.');
      await refetchProposedCvs();
    } catch (error) {
      toastMessage.error(error?.data?.message || 'Failed to unlock proposed CV');
    }
  };

  const handleRemoveProposal = async (proposal) => {
    if (!proposal?.proposedResumeId) return;

    const confirmed = window.confirm('Remove this proposed CV from the current recommendation list?');
    if (!confirmed) return;

    try {
      await removeProposedCv({ proposedResumeId: proposal.proposedResumeId }).unwrap();
      toastMessage.success('Proposed CV removed successfully.');
      if (applications.length === 1 && params.page > 0) {
        setParams((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        await refetchProposedCvs();
      }
    } catch (error) {
      toastMessage.error(error?.data?.message || 'Failed to remove proposed CV');
    }
  };

  if (isUnpublished) {
    return (
      <PublishFirstPlaceholder
        description="AI-recommended candidates will appear here once your job is live."
        className="mt-4"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn mt-4">
      {/* Header bar */}
      <div className="bg-white dark:bg-surface-dark shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-primary text-base" />
            <span className="font-semibold text-neutral-800 dark:text-white">{totalElements}</span> proposed CVs found
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-[180px]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Minimum match rate</p>
              <InputNumber
                min={MIN_MATCH_RATE}
                max={MAX_MATCH_RATE}
                value={minMatchRate}
                onChange={(value) => setMinMatchRate(normalizeMinMatchRate(value))}
                disabled={isBusyRefreshing}
                addonAfter="%"
                className="mt-1 w-full"
              />
            </div>
            <button
              type="button"
              onClick={handleRefreshProposedCvs}
              disabled={isBusyRefreshing}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                isBusyRefreshing
                  ? 'cursor-not-allowed bg-orange-50 text-orange-300 border border-orange-100'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
              }`}
              title={isRefreshPending ? 'Refresh request is already in progress' : 'Refresh proposed CVs'}
            >
              <RefreshCw size={15} className={isBusyRefreshing ? 'animate-spin' : ''} />
              {isBusyRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          Only candidates with AI match rate at or above {normalizeMinMatchRate(minMatchRate)}% will be kept in the proposed list after refresh.
        </p>
      </div>

      {isRefreshPending && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-amber-300 border-t-amber-600 animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Refreshing proposed CVs</p>
            <p className="text-xs text-amber-700 mt-1">
              AI is processing this job in the background. We&apos;ll keep the current list visible until the new results are ready.
            </p>
          </div>
        </div>
      )}

      {!isRefreshPending && hasEvaluationInProgress && (
        <div className="bg-sky-50 border border-sky-200 text-sky-800 rounded-2xl px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-sky-300 border-t-sky-600 animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">AI scoring is still running</p>
            <p className="text-xs text-sky-700 mt-1">
              We&apos;re polling this list for fresh AI overviews and scores. You can keep reviewing candidates while new results stream in.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-surface-dark shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 320 }}>
        {isLoading ? (
          <Loading className="py-20" size={96} />
        ) : applications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
              {isRefreshPending ? (
                <RefreshCw size={28} className="text-orange-400 animate-spin" />
              ) : (
                <Users size={28} className="text-orange-400" />
              )}
            </div>
            <p className="text-sm font-semibold text-neutral-500">
              {isRefreshPending ? 'Refreshing proposed CVs' : 'No proposed CVs yet'}
            </p>
            <p className="text-xs text-neutral-400">
              {isRefreshPending
                ? 'We are generating recommendations for this job. New results will appear here soon.'
                : 'Recommended candidates will appear here.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse table-fixed">
                <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-900 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 w-[24%] text-sm font-semibold text-gray-500 tracking-wide">Candidate</th>
                    <th className="px-6 py-4 w-[28%] text-sm font-semibold text-gray-500 tracking-wide">AI Overview</th>
                    <th className="px-6 py-4 w-[23%] text-sm font-semibold text-gray-500 tracking-wide">Strengths</th>
                    <th className="px-6 py-4 w-[15%] text-sm font-semibold text-gray-500 tracking-wide text-center">AI Match Rate</th>
                    <th className="px-6 py-4 w-[10%] text-center text-sm font-semibold text-gray-500 tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
                  {normalizedApplications.map((app) => {
                    const strengthItems = getStrengthItems(app);

                    return (
                      <tr key={app.proposedResumeId ?? app.resumeId} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs border border-orange-200">
                              {app.isUnlocked ? app.fullName?.substring(0, 2).toUpperCase() : 'AI'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {app.isUnlocked ? (app.fullName || 'Unknown Candidate') : 'Locked candidate profile'}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate leading-none mt-1" title={app.address}>
                                <MapPin size={12} className="flex-shrink-0" /> {app.isUnlocked ? (app.address || 'No address provided') : 'Unlock to view location'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-2">
                            <div className="flex items-start gap-2">
                              <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                                isEvaluationPendingStatus(app.evaluationStatus)
                                  ? 'border-2 border-orange-200 border-t-orange-500 animate-spin'
                                  : 'bg-orange-100 text-orange-500'
                              }`}>
                                {!isEvaluationPendingStatus(app.evaluationStatus) && (
                                  <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[10px]" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-700">
                                  {isEvaluationPendingStatus(app.evaluationStatus) ? 'AI overview is updating' : 'AI overview'}
                                </p>
                                <p
                                  className="mt-1 text-xs leading-relaxed text-gray-600 line-clamp-3"
                                  title={getOverviewTitle(app)}
                                >
                                  {getOverviewText(app)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {strengthItems.length > 0 ? (
                            <ul
                              className="space-y-1.5"
                              title={strengthItems.join('\n')}
                            >
                              {strengthItems.map((strength, index) => (
                                <li
                                  key={`${app.proposedResumeId ?? app.resumeId}-strength-${index}`}
                                  className="flex items-start gap-2 text-xs leading-relaxed text-gray-600"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                                  <span className="line-clamp-1">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              {getStrengthFallbackText(app)}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-sm font-semibold ${getScoreColor(app.matchRate)}`}>
                              {app.matchRate != null ? `${getDisplayRate(app.matchRate)}%` : '--'}
                            </span>
                            {isEvaluationPendingStatus(app.evaluationStatus) && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-500">
                                <RefreshCw size={11} className="animate-spin" />
                                Scoring...
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {app.isUnlocked && app.resumeId ? (
                              <button
                                onClick={() => navigate(`/jobs/${jobId}/proposed-cvs/${app.resumeId}?proposedResumeId=${app.proposedResumeId}`)}
                                className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-orange-500/10 text-gray-400 hover:text-orange-500 rounded-xl transition-all border border-transparent hover:border-orange-500/20"
                                title="View Profile"
                              >
                                <ExternalLink size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnlockProposal(app)}
                                disabled={isMutatingProposal}
                                className={`p-2.5 rounded-xl transition-all border ${isMutatingProposal
                                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300'
                                  : 'border-transparent bg-gray-50 text-gray-400 hover:border-orange-500/20 hover:bg-orange-500/10 hover:text-orange-500'
                                  }`}
                                title="Unlock Profile"
                              >
                                <Lock size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveProposal(app)}
                              disabled={isMutatingProposal}
                              className={`p-2.5 rounded-xl transition-all border ${isMutatingProposal
                                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300'
                                : 'border-transparent bg-gray-50 text-gray-400 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500'
                                }`}
                              title="Remove Proposal"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-50 dark:border-neutral-800 bg-white dark:bg-surface-dark flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">
                Showing <span className="text-gray-900 dark:text-white font-semibold">{applications.length}</span> of <span className="text-gray-900 dark:text-white font-semibold">{totalElements}</span> Candidates
                {isFetching && (
                  <span className="ml-2 inline-flex items-center gap-1 text-orange-500">
                    <RefreshCw size={12} className="animate-spin" />
                    Updating...
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setParams(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                  disabled={params.page === 0}
                  className={`p-2 rounded-xl transition-all ${params.page === 0 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setParams(prev => ({ ...prev, page: index }))}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${params.page === index
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setParams(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={params.page >= Math.max(0, totalPages - 1)}
                  className={`p-2 rounded-xl transition-all ${params.page >= Math.max(0, totalPages - 1) ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PublishFirstPlaceholder = ({ description, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-24 gap-4 animate-fadeIn ${className}`}>
    <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
      <FontAwesomeIcon icon={faRocket} className="text-4xl text-amber-400" />
    </div>
    <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Publish your job first</h3>
    <p className="text-sm text-neutral-400 text-center max-w-sm">{description}</p>
  </div>
);

// Helper Components
const normalizeProposal = (proposal = {}) => ({
  proposedResumeId: proposal.id ?? proposal.proposedResumeId ?? null,
  resumeId: proposal.identity?.resumeId ?? proposal.resumeId ?? null,
  candidateId: proposal.identity?.candidateId ?? proposal.candidateId ?? null,
  jobId: proposal.identity?.jobId ?? proposal.jobId ?? null,
  fullName: proposal.candidate?.fullName ?? proposal.fullName ?? null,
  jobTitle: proposal.candidate?.jobTitle ?? proposal.jobTitle ?? null,
  address: proposal.candidate?.address ?? proposal.address ?? null,
  isUnlocked: proposal.access?.unlocked ?? proposal.isUnlocked ?? false,
  matchRate: proposal.scores?.matchRate ?? proposal.matchRate ?? null,
  aiScore: proposal.scores?.aiScore ?? proposal.aiScore ?? null,
  overview: proposal.scores?.overview ?? proposal.overview ?? null,
  strengths: proposal.scores?.strengths ?? proposal.strengths ?? null,
  evaluationStatus: proposal.scores?.evaluationStatus ?? proposal.evaluationStatus ?? null,
  status: proposal.status ?? null,
  proposedAt: proposal.proposedAt ?? null,
});

const isEvaluationPendingStatus = (status) => status === 'WAITING' || status === 'PARTIAL';

const getOverviewText = (proposal) => {
  if (isEvaluationPendingStatus(proposal?.evaluationStatus)) {
    return 'AI is evaluating how this resume matches the current job. Overview will appear automatically when scoring is complete.';
  }

  return normalizeOverview(proposal?.overview) || 'No AI overview available yet.';
};

const getOverviewTitle = (proposal) => normalizeOverview(proposal?.overview) || getOverviewText(proposal);

const normalizeOverview = (overview) => {
  if (!overview) return '';

  return String(overview)
    .replace(/<\/?(ul|ol)>/gi, '')
    .replace(/<li>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const extractInsightItems = (content, { splitComma = false } = {}) => {
  if (!content) return [];

  const normalized = String(content)
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '')
    .replace(/<\/?(ul|ol)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\r/g, '');

  const lines = normalized
    .split('\n')
    .map((line) => line.replace(/^[-*+\u2022]\s*/, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  if (splitComma && lines.length === 1 && lines[0].includes(',')) {
    return lines[0]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return lines;
};

const getStrengthItems = (proposal) => {
  if (isEvaluationPendingStatus(proposal?.evaluationStatus)) {
    return ['AI is still identifying the strongest signals in this resume.'];
  }

  const strengths = extractInsightItems(proposal?.strengths, { splitComma: true });
  return strengths.slice(0, 3);
};

const getStrengthFallbackText = (proposal) => (
  isEvaluationPendingStatus(proposal?.evaluationStatus)
    ? 'Strengths are being generated...'
    : 'No strengths available yet.'
);

const getDisplayRate = (rate) => {
  const numericRate = Number(rate) || 0;
  return numericRate <= 1 && numericRate > 0
    ? Math.round(numericRate * 100)
    : Math.round(numericRate);
};

const getScoreColor = (score) => {
  if (score == null) return 'text-gray-300';
  const percent = getDisplayRate(score);
  if (percent >= 80) return 'text-emerald-500';
  if (percent >= 60) return 'text-orange-500';
  return 'text-red-500';
};

const normalizeMinMatchRate = (value) => {
  if (value == null || value === '') return DEFAULT_MIN_MATCH_RATE;
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return DEFAULT_MIN_MATCH_RATE;
  return Math.min(MAX_MATCH_RATE, Math.max(MIN_MATCH_RATE, Math.round(numericValue)));
};

export default ProposedCVs;
