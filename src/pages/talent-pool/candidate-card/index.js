import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Mail, MapPin, Briefcase, X } from 'lucide-react';
import { Tooltip } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const CandidateCard = ({ candidate, index, onRemove, poolColor }) => {
    const navigate = useNavigate();

    const getScoreColor = (score) => {
        if (!score && score !== 0) return 'text-gray-400';
        if (score >= 80) return 'text-emerald-600';
        if (score >= 50) return 'text-orange-500';
        return 'text-red-500';
    };

    const scoreValue = candidate.evaluation?.aiScore;

    return (
        <Draggable
            draggableId={candidate.applicationId.toString()}
            index={index}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                    className={`shrink-0 ${snapshot.isDragging ? 'z-50 shadow-2xl scale-[1.02]' : ''}`}
                >
                    <div
                        className="w-[240px] bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing group relative overflow-hidden"
                        style={{ borderLeft: `3px solid ${poolColor || '#9CA3AF'}` }}
                    >
                        {/* Remove button */}
                        <Tooltip title="Remove from pool">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(candidate.applicationId);
                                }}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500 transition-all z-10"
                            >
                                <X size={12} />
                            </button>
                        </Tooltip>

                        {/* Top section: Name + Email + Score */}
                        <div className="px-4 pt-3.5 pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <h4
                                        className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate cursor-pointer hover:underline uppercase tracking-wide"
                                        onClick={() => navigate(`/applications/${candidate.applicationId}`)}
                                    >
                                        {candidate.candidateName}
                                    </h4>
                                    <p className="text-xs text-primary/80 truncate mt-0.5">
                                        {candidate.candidateEmail || 'N/A'}
                                    </p>
                                </div>
                                {scoreValue != null && (
                                    <span className={`text-base font-bold shrink-0 ${getScoreColor(scoreValue)}`}>
                                        {(scoreValue / 10).toFixed(1)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-gray-100 dark:border-gray-700 mx-4" />

                        {/* Bottom section: Job + Location + Date */}
                        <div className="px-4 pt-2.5 pb-3 space-y-1.5">
                            {candidate.jobTitle && (
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                    <Briefcase size={12} className="shrink-0 text-gray-400" />
                                    <span className="truncate font-medium">{candidate.jobTitle}</span>
                                </div>
                            )}
                            {candidate.location && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <MapPin size={12} className="shrink-0 text-gray-400" />
                                    <span className="truncate">{candidate.location}</span>
                                </div>
                            )}
                            <p className="text-[11px] text-primary/60 mt-1">
                                Added at {candidate.appliedAt ? moment(candidate.appliedAt).format('MMM DD, YYYY') : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default CandidateCard;
