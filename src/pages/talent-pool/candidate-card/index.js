import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Briefcase, X, Calendar } from 'lucide-react';
import { Tooltip, Modal } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const CandidateCard = ({ candidate, index, onRemove, poolColor, poolId }) => {
    const navigate = useNavigate();

    const getScoreColor = (score) => {
        if (!score && score !== 0) return 'text-gray-400';
        if (score >= 80) return 'text-emerald-600';
        if (score >= 50) return 'text-orange-500';
        return 'text-red-500';
    };

    const scoreValue = candidate.aiOverallScore;
    const proposedId = candidate.proposedId || candidate.proposedResumeId || candidate.proposed_id;
    const isProposed = !!proposedId;
    const dragId = `${candidate.id}_${candidate.applicationId || ''}_${proposedId || ''}`;

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        Modal.confirm({
            title: 'Remove Candidate',
            content: `Are you sure you want to remove ${candidate.candidateName} from this talent pool?`,
            okText: 'Remove',
            okButtonProps: { danger: true },
            cancelText: 'Cancel',
            centered: true,
            onOk: () => {
                onRemove(candidate.id);
            }
        });
    };

    const handleCardClick = () => {
        const queryParams = new URLSearchParams();
        if (candidate.id) queryParams.set('itemId', candidate.id);
        if (poolId) queryParams.set('groupId', poolId);
        if (candidate.applicationId) queryParams.set('applicationId', candidate.applicationId);
        if (proposedId) queryParams.set('proposedId', proposedId);
        
        const queryStr = queryParams.toString();

        if (candidate.applicationId) {
            navigate(`/applications/${candidate.applicationId}`);
            return;
        }

        if (candidate.jobId && isProposed) {
            const routeResumeId = candidate.resumeId ?? `proposal-${proposedId}`;
            navigate(`/jobs/${candidate.jobId}/proposed-cvs/${routeResumeId}?proposedResumeId=${proposedId}`);
            return;
        }

        if (candidate.resumeId) {
            navigate(`/talent-pool/cv/${candidate.resumeId}`);
        }
    };

    return (
        <Draggable
            draggableId={dragId}
            index={index}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                >
                    <div
                        className="w-[260px] bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing group relative overflow-hidden"
                        style={{ borderLeft: `3px solid ${poolColor || '#9CA3AF'}` }}
                    >
                        {/* Remove button */}
                        <Tooltip title="Remove from pool">
                            <button
                                onClick={handleRemoveClick}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500 transition-all z-10"
                            >
                                <X size={12} />
                            </button>
                        </Tooltip>

                        {/* Top section: Name + Email + Score */}
                        <div className="px-4 pt-3.5 pb-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <h4
                                        className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate cursor-pointer hover:underline uppercase tracking-wide"
                                        onClick={handleCardClick}
                                        title={candidate.candidateName}
                                    >
                                        {candidate.candidateName}
                                    </h4>
                                    <p className="text-xs text-gray-400 truncate mt-0.5">
                                        {candidate.candidateEmail || 'N/A'}
                                    </p>
                                </div>
                                {scoreValue != null && (
                                    <span className={`text-sm font-bold shrink-0 ${getScoreColor(scoreValue)}`}>
                                        {Math.round(scoreValue)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-gray-100 dark:border-gray-700 mx-4" />

                        {/* Bottom section: Job + Location + Date */}
                        <div className="px-4 pt-2.5 pb-3 space-y-1.5">
                            {candidate.originalJobTitle && (
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                    <Briefcase size={12} className="shrink-0 text-gray-400" />
                                    <span className="truncate font-medium">{candidate.originalJobTitle}</span>
                                </div>
                            )}
                            <p className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                <Calendar size={12} className="shrink-0 text-gray-400" />
                                {candidate.addedAt ? moment(candidate.addedAt).format('MMM DD, YYYY') : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default CandidateCard;
