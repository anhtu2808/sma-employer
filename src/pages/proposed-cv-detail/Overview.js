import React from 'react';
import Button from '@/components/Button';
import { useParams } from 'react-router-dom';
import { useInviteCandidateMutation } from '@/apis/jobApi';
import toastMessage from '@/utils/toastMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faWandMagicSparkles } from '../../utils/icons';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';

const Overview = ({ proposal, proposedResumeId, onUnlock, isUnlocking = false, refetch }) => {
    const { jobId } = useParams();
    const [inviteCandidate, { isLoading: isInviting }] = useInviteCandidateMutation();
    const proposalStatusLabel = getProposalStatusBadgeLabel(proposal?.proposalStatus, proposal?.isUnlocked);
    const canInviteCandidate = Boolean(proposal?.isUnlocked) && canInvite(proposal?.proposalStatus);

    const handleInvite = async () => {
        if (!proposal?.candidateId || !Number.isInteger(Number(proposedResumeId))) {
            toastMessage.error('This proposed CV is missing invitation data. Please reopen it from the proposal list.');
            return;
        }

        try {
            await inviteCandidate({
                candidateId: proposal.candidateId,
                jobId: Number(jobId),
                proposedResumeId: Number(proposedResumeId),
            }).unwrap();
            toastMessage.success('Candidate invited successfully!');
            if (refetch) refetch();
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to invite candidate');
        }
    };

    return (
        <div className="px-5 py-5 md:px-6 md:py-6 space-y-4">
            {!proposal?.isUnlocked && (
                <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-900 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <Lock size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Unlock to reveal candidate identity and CV</p>
                            <p className="mt-1 text-xs text-amber-800">
                                AI analysis stays visible, but candidate contact details, social links, and resume preview stay hidden until this proposal is unlocked.
                            </p>
                        </div>
                    </div>
                    <Button
                        mode="primary"
                        size="md"
                        shape="rounded"
                        loading={isUnlocking}
                        onClick={onUnlock}
                    >
                        Unlock Candidate
                    </Button>
                </div>
            )}

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                <div className="min-w-0 space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="text-sm" />
                        Proposed Candidate
                    </div>

                    <div className="space-y-2 min-w-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white break-words">
                            {proposal?.candidateName || 'Unknown Candidate'}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                            {proposal?.jobTitle && (
                                <span className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faBriefcase} className="text-sm" />
                                    {proposal.jobTitle}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start xl:items-end gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <InfoPill icon={<ShieldCheck size={14} />} label={proposalStatusLabel} />
                        <InfoPill icon={<Sparkles size={14} />} label={`AI ${formatPercent(proposal?.aiScore)}`} accent />
                    </div>
                    {canInviteCandidate && (
                        <Button
                            mode="primary"
                            size="md"
                            shape="rounded"
                            loading={isInviting}
                            onClick={handleInvite}
                        >
                            Invite Candidate
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoPill = ({ icon, label, accent = false }) => (
    <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold border ${accent
        ? 'border-orange-200 bg-orange-50 text-orange-600'
        : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
        }`}>
        {icon}
        <span>{label}</span>
    </div>
);

const formatPercent = (value) => {
    if (value == null || Number.isNaN(Number(value))) return '--';
    const numericValue = Number(value);
    const displayValue = numericValue <= 1 && numericValue > 0
        ? Math.round(numericValue * 100)
        : Math.round(numericValue);
    return `${displayValue}%`;
};

const normalizeStatusKey = (status) => String(status || '')
    .trim()
    .replace(/\s+/g, '_')
    .toUpperCase();

const formatProposalStatus = (status) => {
    if (!status) return 'N/A';
    return String(status)
        .toLowerCase()
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
};

const isNoActionStatus = (status) => {
    const normalizedStatus = normalizeStatusKey(status);
    return !normalizedStatus || normalizedStatus === 'NO_ACTION';
};

const canInvite = (status) => isNoActionStatus(status);

const getProposalStatusBadgeLabel = (status, unlocked) => {
    if (!isNoActionStatus(status)) {
        return formatProposalStatus(status);
    }

    return unlocked ? 'Unlocked' : 'Locked';
};

export default Overview;
