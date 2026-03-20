import React, { useState } from 'react';
import ScoreCard from '../score-card';

const getTransferabilityConfig = (level) => {
    switch (level) {
        case 'HIGH': return { label: 'High Transferability', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
        case 'MEDIUM': return { label: 'Medium Transferability', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
        case 'LOW': return { label: 'Low Transferability', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
        default: return null;
    }
};

const CriteriaItem = ({ criteria }) => {
    const [expanded, setExpanded] = useState(false);
    const score = criteria.aiScore ?? 0;
    const barColor = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';

    return (
        <div className="border border-gray-100 dark:border-neutral-800 rounded-xl overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200 truncate">
                            {criteria.criteriaName || 'Criteria'}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                            {criteria.scoringCriteriaWeight != null && (
                                <span className="text-[10px] font-medium text-gray-400 dark:text-neutral-500">
                                    w:{criteria.scoringCriteriaWeight}
                                </span>
                            )}
                            <span className={`text-sm font-bold ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                {score}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${score}%` }} />
                    </div>
                </div>
                <span className={`material-icons-round text-lg text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {expanded && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-50 dark:border-neutral-800">
                    {criteria.aiExplanation && (
                        <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
                            {criteria.aiExplanation}
                        </p>
                    )}
                    {criteria.details?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {criteria.details.map((detail) => (
                                <span
                                    key={detail.id}
                                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                                        detail.status === 'MATCHED'
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                            : detail.status === 'FIXED'
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                    }`}
                                >
                                    <span className="material-icons-round text-[13px]">
                                        {detail.status === 'MATCHED' ? 'check_circle' : detail.status === 'FIXED' ? 'build_circle' : 'cancel'}
                                    </span>
                                    {detail.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const AiAnalysis = ({ aiEvaluation }) => {
    if (!aiEvaluation) return null;

    const {
        aiOverallScore,
        matchLevel,
        summary,
        strengths,
        weakness,
        isTrueLevel,
        hasRelatedExperience,
        transferabilityToRole,
        criteriaScores = [],
    } = aiEvaluation;

    const transferConfig = getTransferabilityConfig(transferabilityToRole);

    return (
        <div className="space-y-5">
            {/* Header: Score + Summary */}
            <div className="flex items-start gap-5">
                <ScoreCard score={aiOverallScore} size={88} matchLevel={matchLevel} />
                <div className="flex-1 min-w-0 pt-1">
                    {summary && (
                        <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">{summary}</p>
                    )}
                    {/* Meta badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {isTrueLevel && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <span className="material-icons-round text-[13px]">verified</span>
                                True Level
                            </span>
                        )}
                        {hasRelatedExperience && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                <span className="material-icons-round text-[13px]">work</span>
                                Related Experience
                            </span>
                        )}
                        {transferConfig && (
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${transferConfig.cls}`}>
                                <span className="material-icons-round text-[13px]">swap_horiz</span>
                                {transferConfig.label}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Strengths / Weaknesses */}
            {(strengths || weakness) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {strengths && (
                        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-icons-round text-emerald-600 text-lg">thumb_up</span>
                                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Strengths</h4>
                            </div>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300/80 leading-relaxed whitespace-pre-line">{strengths}</p>
                        </div>
                    )}
                    {weakness && (
                        <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-icons-round text-red-500 text-lg">thumb_down</span>
                                <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Weaknesses</h4>
                            </div>
                            <p className="text-sm text-red-700 dark:text-red-300/80 leading-relaxed whitespace-pre-line">{weakness}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Criteria Breakdown */}
            {criteriaScores.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 mb-3">Criteria Breakdown</h4>
                    <div className="space-y-2">
                        {criteriaScores.map((criteria) => (
                            <CriteriaItem key={criteria.id} criteria={criteria} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiAnalysis;
