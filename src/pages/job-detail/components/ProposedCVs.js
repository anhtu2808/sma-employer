import React, { useEffect, useRef, useState } from 'react';
import { InputNumber, Modal } from 'antd';
import {
  useGetProposedCvsQuery,
  useRefreshProposedCvsMutation,
  useRemoveProposedCvMutation,
  useUnlockProposedCvMutation,
  jobApi,
} from '../../../apis/jobApi';
import { useGetJobDetailQuery } from '@/apis/apis';
import Loading from '@/components/Loading';
import { ChevronLeft, ChevronRight, ExternalLink, Lock, Mail, Phone, RefreshCw, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faWandMagicSparkles } from '../../../utils/icons';
import toastMessage from '@/utils/toastMessage';
import { useDispatch } from 'react-redux';

const POLLING_INTERVAL = 5000;
const DEFAULT_MIN_SCORE = 30;
const MIN_SCORE = 0;
const MAX_SCORE = 100;

const ProposedCVs = ({ jobId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isJobPolling, setIsJobPolling] = useState(false);
  const [isEvaluationPolling, setIsEvaluationPolling] = useState(false);
  const previousRefreshPendingRef = useRef(false);
  const [draftMinScore, setDraftMinScore] = useState(DEFAULT_MIN_SCORE);
  const [isDraftDirty, setIsDraftDirty] = useState(false);

  const {
    data: jobData,
    refetch: refetchJobDetail,
  } = useGetJobDetailQuery(jobId, {
    skip: !jobId,
    pollingInterval: isJobPolling ? POLLING_INTERVAL : 0,
    refetchOnMountOrArgChange: true,
  });
  const jobStatus = jobData?.data?.status;
  const persistedAppliedMinAiScore = jobData?.data?.proposeRefreshMinAiScore;
  const persistedTargetMinAiScore = jobData?.data?.proposeRefreshTargetMinAiScore;
  const isUnpublished = jobStatus === 'DRAFT' || jobStatus === 'PENDING_REVIEW';
  const isRefreshPending = Boolean(jobData?.data?.proposeRefreshPending);
  const appliedMinScore = normalizeMinScore(persistedAppliedMinAiScore);
  const pendingTargetMinScore = normalizeMinScore(
    persistedTargetMinAiScore ?? persistedAppliedMinAiScore
  );
  const requestedMinScore = isRefreshPending ? pendingTargetMinScore : appliedMinScore;

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
  const hasUnscoredProposal = normalizedApplications.some((proposal) => !isProposalScored(proposal));
  const totalElements = data.totalElements;
  const totalPages = data.totalPages;
  const isBusyRefreshing = isRefreshingRequest;
  const isMutatingProposal = isUnlocking || isRemoving;
  const canSubmitRefresh = !isRefreshingRequest && !isRefreshPending && !hasUnscoredProposal;
  const hasNoProposedCvs = !isLoading && !isRefreshPending && applications.length === 0;

  useEffect(() => {
    setIsJobPolling(isRefreshPending);
  }, [isRefreshPending]);

  useEffect(() => {
    const wasRefreshPending = previousRefreshPendingRef.current;

    if (wasRefreshPending && !isRefreshPending) {
      dispatch(jobApi.util.invalidateTags([{ type: 'Jobs', id: `PROPOSED_${jobId}` }]));
    }

    previousRefreshPendingRef.current = isRefreshPending;
  }, [isRefreshPending, dispatch, jobId]);

  useEffect(() => {
    setIsEvaluationPolling(hasEvaluationInProgress);
  }, [hasEvaluationInProgress]);

  useEffect(() => {
    setIsDraftDirty(false);
  }, [jobId]);

  useEffect(() => {
    if (!isDraftDirty) {
      setDraftMinScore(requestedMinScore);
    }
  }, [isDraftDirty, jobId, requestedMinScore]);

  useEffect(() => {
    if (draftMinScore === requestedMinScore) {
      setIsDraftDirty(false);
    }
  }, [draftMinScore, requestedMinScore]);

  const handleRefreshProposedCvs = async () => {
    if (!jobId) return;

    try {
      const normalizedMinScore = normalizeMinScore(draftMinScore);
      const result = await refreshProposedCvs({
        id: jobId,
        minAiScore: normalizedMinScore,
        minMatchRate: normalizedMinScore,
      }).unwrap();
      setIsDraftDirty(false);
      toastMessage.success(result?.message || 'Refreshing proposed CVs in the background.');
      await refetchJobDetail();
    } catch (error) {
      toastMessage.error(error?.data?.message || 'Failed to refresh proposed CVs');
    }
  };

  const handleDraftMinScoreChange = (value) => {
    if (value === null || value === '') {
      setDraftMinScore(null);
      setIsDraftDirty(null !== requestedMinScore);
      return;
    }
    const normalizedValue = normalizeMinScore(value);
    setDraftMinScore(normalizedValue);
    setIsDraftDirty(normalizedValue !== requestedMinScore);
  };

  const openProposalDetail = (proposal) => {
    if (!proposal?.proposedResumeId) return;

    const routeResumeId = proposal.resumeId ?? `proposal-${proposal.proposedResumeId}`;
    navigate(`/jobs/${jobId}/proposed-cvs/${routeResumeId}?proposedResumeId=${proposal.proposedResumeId}`);
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

  const handleRemoveProposal = (proposal) => {
    if (!proposal?.proposedResumeId) return;

    Modal.confirm({
      title: 'Remove Proposed CV',
      content: 'Remove this proposed CV from the current recommendation list?',
      okText: 'Yes, Remove',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          await removeProposedCv({ proposedResumeId: proposal.proposedResumeId }).unwrap();
          toastMessage.success('Proposed CV removed successfully.');

          if (applications.length === 1 && params.page > 0) {
            setParams((prev) => ({ ...prev, page: prev.page - 1 }));
          }

          dispatch(jobApi.util.invalidateTags([{ type: 'Jobs', id: `PROPOSED_${jobId}` }]));
        } catch (error) {
          toastMessage.error(error?.data?.message || 'Failed to remove proposed CV');
        }
      }
    });
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
            <div className="w-full sm:w-[240px]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Minimum score</p>
              <div className="mt-1 flex h-[42px] items-stretch overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-colors focus-within:border-orange-400">
                <InputNumber
                  min={MIN_SCORE}
                  max={MAX_SCORE}
                  value={draftMinScore}
                  onChange={handleDraftMinScoreChange}
                  disabled={isBusyRefreshing}
                  controls={false}
                  className="h-full w-full !border-0 !shadow-none [&_.ant-input-number-input-wrap]:h-full [&_.ant-input-number-input]:h-full [&_.ant-input-number-input]:px-4 [&_.ant-input-number-input]:text-sm [&_.ant-input-number-input]:font-semibold"
                />
                <div className="flex items-center border-l border-neutral-200 px-3 text-sm font-semibold text-neutral-500">
                  %
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRefreshProposedCvs}
              disabled={!canSubmitRefresh}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${!canSubmitRefresh
                ? 'cursor-not-allowed bg-orange-50 text-orange-300 border border-orange-100'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
                }`}
              title={getRefreshButtonTitle({ isRefreshPending, hasUnscoredProposal })}
            >
              <RefreshCw size={15} className={isRefreshingRequest ? 'animate-spin' : ''} />
              Get Propose CV
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          {isRefreshPending
            ? `A refresh is running with the current ${requestedMinScore}% minimum score for AI score and match rate. The list will update automatically when it finishes.`
            : hasUnscoredProposal
              ? 'Refresh will be available after every proposed candidate has finished AI scoring.'
              : isDraftDirty
                ? `Refresh to apply the new ${normalizeMinScore(draftMinScore)}% minimum score for AI score and match rate.`
                : `Only candidates meeting the ${appliedMinScore}% match-rate threshold and AI score threshold will stay visible after scoring.`}
        </p>
      </div>

      {isRefreshPending && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-amber-300 border-t-amber-600 animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Refreshing proposed CVs</p>
            <p className="text-xs text-amber-700 mt-1">
              {`AI is processing this job in the background with the current ${requestedMinScore}% minimum score for AI score and match rate. We'll keep the current list visible until the new results are ready.`}
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

      {hasNoProposedCvs && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <Users size={14} />
          </div>
          <div>
            <p className="text-sm font-semibold">No resumes were proposed for this job</p>
            <p className="text-xs text-orange-700 mt-1">
              No resumes matched the current proposal criteria. Try refreshing proposed CVs or lowering the minimum score to find more candidates.
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
              {isRefreshPending ? 'Refreshing proposed CVs' : 'No resumes were proposed'}
            </p>
            <p className="text-xs text-neutral-400">
              {isRefreshPending
                ? 'We are generating recommendations for this job. New results will appear here soon.'
                : 'Try refreshing proposed CVs or lowering the minimum score to find more candidates.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full min-w-[1040px] text-left border-collapse table-fixed">
                <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-900 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 w-[22%] text-sm font-semibold text-gray-500 tracking-wide">Candidate</th>
                    <th className="px-6 py-4 w-[34%] text-sm font-semibold text-gray-500 tracking-wide">AI Overview</th>
                    <th className="px-6 py-4 w-[26%] text-sm font-semibold text-gray-500 tracking-wide">Strengths</th>
                    <th className="px-6 py-4 w-[10%] text-sm font-semibold text-gray-500 tracking-wide text-center">AI Score</th>
                    <th className="px-6 py-4 w-[8%] text-center text-sm font-semibold text-gray-500 tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
                  {normalizedApplications.map((app) => {
                    const strengthItems = getStrengthItems(app);

                    return (
                      <tr key={app.proposedResumeId ?? app.resumeId} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="min-w-0 space-y-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {app.fullName || 'Unknown Candidate'}
                            </p>
                            {app.email || app.phone ? (
                              <div className="min-w-0 space-y-1.5">
                                {app.email && (
                                  <a
                                    href={`mailto:${app.email}`}
                                    className="flex min-w-0 items-center gap-2 text-xs font-medium text-gray-600 hover:text-orange-500"
                                    title={app.email}
                                  >
                                    <Mail size={13} className="flex-shrink-0 text-gray-400" />
                                    <span className="truncate">{app.email}</span>
                                  </a>
                                )}
                                {app.phone && (
                                  <a
                                    href={`tel:${app.phone}`}
                                    className="flex min-w-0 items-center gap-2 text-xs font-medium text-gray-600 hover:text-orange-500"
                                    title={app.phone}
                                  >
                                    <Phone size={13} className="flex-shrink-0 text-gray-400" />
                                    <span className="truncate">{app.phone}</span>
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">No contact available</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-2">
                            <div className="flex items-start gap-2">
                              <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${isEvaluationPendingStatus(app.evaluationStatus)
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
                            <span className={`text-sm font-semibold ${getScoreColor(app.aiScore)}`}>
                              {app.aiScore != null ? `${getDisplayRate(app.aiScore)}%` : '--'}
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
                            <button
                              onClick={() => openProposalDetail(app)}
                              className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-orange-500/10 text-gray-400 hover:text-orange-500 rounded-xl transition-all border border-transparent hover:border-orange-500/20"
                              title={app.isUnlocked ? 'View candidate details' : 'View masked candidate details'}
                            >
                              <ExternalLink size={16} />
                            </button>
                            {!app.isUnlocked && (
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
  email: proposal.candidate?.email ?? proposal.email ?? null,
  phone: proposal.candidate?.phone ?? proposal.phone ?? null,
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

const isProposalScored = (proposal) => {
  if (!proposal) return true;
  if (isEvaluationPendingStatus(proposal.evaluationStatus)) return false;
  if (proposal.evaluationStatus === 'FAIL') return true;
  return proposal.aiScore != null;
};

const getRefreshButtonTitle = ({ isRefreshPending, hasUnscoredProposal }) => {
  if (isRefreshPending) {
    return 'Refresh is already running';
  }
  if (hasUnscoredProposal) {
    return 'Wait until all proposed candidates finish AI scoring';
  }
  return 'Get propose CVs';
};

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

const normalizeMinScore = (value) => {
  if (value == null || value === '') return DEFAULT_MIN_SCORE;
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return DEFAULT_MIN_SCORE;
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, Math.round(numericValue)));
};

export default ProposedCVs;
