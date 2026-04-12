import React from 'react';
import Button from '@/components/Button';
import { useParams } from 'react-router-dom';
import { useInviteCandidateMutation } from '@/apis/jobApi';
import toastMessage from '@/utils/toastMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faWandMagicSparkles } from '../../utils/icons';
import { MapPin, ShieldCheck, Sparkles, Target } from 'lucide-react';

const Overview = ({ cvData, proposedResumeId }) => {
    const { jobId } = useParams();
    const [inviteCandidate, { isLoading }] = useInviteCandidateMutation();

    const handleInvite = async () => {
        if (!cvData?.candidate_id || !Number.isInteger(Number(proposedResumeId))) {
            toastMessage.error('This proposed CV is missing invitation data. Please reopen it from the proposal list.');
            return;
        }

        try {
            await inviteCandidate({
                candidateId: cvData.candidate_id,
                jobId: Number(jobId),
                proposedResumeId: Number(proposedResumeId)
            }).unwrap();
            toastMessage.success('Candidate invited successfully!');
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to invite candidate');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="text-orange-500 text-lg" />
                        <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">
                            Proposed Candidate
                        </span>
                    </div>

                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        {cvData.full_name || cvData.resume_name || cvData.file_name || 'Unknown Candidate'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        {cvData.email && (
                            <span className="flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                                {cvData.email}
                            </span>
                        )}
                        {cvData.phone && (
                            <span className="flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faPhone} className="text-sm" />
                                {cvData.phone}
                            </span>
                        )}
                        {cvData.address && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {cvData.address}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    <InfoPill icon={<ShieldCheck size={14} />} label={cvData.unlocked ? 'Unlocked' : 'Locked'} />
                    <InfoPill icon={<Target size={14} />} label={`Match ${formatPercent(cvData.match_rate)}`} />
                    <InfoPill icon={<Sparkles size={14} />} label={`AI ${formatPercent(cvData.ai_overall_score)}`} accent />
                    <Button
                        mode="primary"
                        size="md"
                        shape="round"
                        loading={isLoading}
                        onClick={handleInvite}
                    >
                        Invite Candidate
                    </Button>
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

export default Overview;
