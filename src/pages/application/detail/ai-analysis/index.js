import React, { useState } from 'react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, ResponsiveContainer, Tooltip,
} from 'recharts';
import ScoreCard from '../score-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBriefcase, faChevronDown, faCircleCheck,
    faCircleXmark, faGear, faThumbsDown, faThumbsUp,
} from '../../../../utils/icons';
import { getCandidateLevelBadgeClasses } from '@/utils/candidateLevel';

const CustomRadarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 dark:bg-neutral-800/95 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-700 text-sm">
                <p className="font-bold text-gray-800 dark:text-neutral-200">{payload[0]?.payload?.fullName}</p>
                <p className="text-gray-600 dark:text-neutral-400">Score: <span className="font-bold">{payload[0]?.value}</span></p>
            </div>
        );
    }
    return null;
};

const CustomTick = ({ payload, x, y, cx, cy, textAnchor }) => {
    const OFFSET = 14;
    const dx = x - cx;
    const dy = y - cy;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / length;
    const ny = dy / length;
    return (
        <text
            x={x + nx * OFFSET}
            y={y + ny * OFFSET}
            textAnchor={textAnchor}
            fill="#374151"
            style={{ fontSize: 12, fontWeight: 700 }}
        >
            {payload.value}
        </text>
    );
};

const CriteriaItem = ({ criteria, isOpen, onToggle }) => {
    const score = criteria.aiScore ?? 0;
    const barColor = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';

    return (
        <div className="border border-gray-100 dark:border-neutral-800 rounded-xl overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-base font-semibold text-gray-800 dark:text-neutral-200 truncate">
                            {criteria.criteriaName || 'Criteria'}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-base font-bold ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                {score}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${score}%` }} />
                    </div>
                </div>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-lg text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-50 dark:border-neutral-800">
                    {criteria.aiExplanation && (
                        <p className="text-base text-gray-700 dark:text-neutral-300 leading-relaxed">
                            {criteria.aiExplanation}
                        </p>
                    )}
                    {criteria.details?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {criteria.details.map((detail) => (
                                <span
                                    key={detail.id}
                                    className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${detail.status === 'MATCHED'
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                            : detail.status === 'FIXED'
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={detail.status === 'MATCHED' ? faCircleCheck : detail.status === 'FIXED' ? faGear : faCircleXmark} className="text-[13px]" />
                                    {detail.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AiAnalysis = ({ aiEvaluation, hideOverviewSections = false }) => {
    const [openCriteriaId, setOpenCriteriaId] = useState(null);

    if (!aiEvaluation) return null;

    const {
        aiOverallScore,
        matchLevel,
        summary,
        strengths,
        weakness,
        candidateLevel,
        criteriaScores: rawCriteriaScores = [],
    } = aiEvaluation;

    const criteriaScores = [...rawCriteriaScores]
        .sort((a, b) => (a.criteriaName || '').localeCompare(b.criteriaName || ''));

    // Radar chart data
    const radarData = criteriaScores
        .filter((cs) => cs.criteriaName)
        .map((cs) => ({
            criteriaName: cs.criteriaName.length > 16 ? cs.criteriaName.substring(0, 14) + '...' : cs.criteriaName,
            fullName: cs.criteriaName,
            score: typeof cs.aiScore === 'number' ? cs.aiScore : 0,
        }));
    const showSummary = !hideOverviewSections && Boolean(summary);
    const showCandidateLevel = !hideOverviewSections && Boolean(candidateLevel);
    const showStrengths = !hideOverviewSections && Boolean(strengths);
    const showWeakness = !hideOverviewSections && Boolean(weakness);
    const showHeaderContent = showSummary || showCandidateLevel;

    return (
        <div className="space-y-5">
            {/* Header: Score + Summary */}
            <div className={`items-start gap-5 ${showHeaderContent ? 'flex' : 'inline-flex'}`}>
                <ScoreCard score={aiOverallScore} size={88} matchLevel={matchLevel} />
                {showHeaderContent && (
                    <div className="flex-1 min-w-0 pt-1">
                        {showSummary && (
                            <ul
                                className="space-y-1.5 mt-0.5 list-disc pl-4 text-base text-gray-700 dark:text-neutral-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: summary }}
                            />
                        )}
                        {/* Meta badges */}
                        {showCandidateLevel && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${getCandidateLevelBadgeClasses(candidateLevel, 'soft')}`}>
                                    <FontAwesomeIcon icon={faBriefcase} className="text-[13px]" />
                                    {candidateLevel}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                <div className="text-amber-500 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                    AI models can make mistakes. Scores and evaluations are <b>approximations</b> based on the provided data. Please verify important information manually.
                </p>
            </div>
            {/* Strengths — full width */}
            {showStrengths && (
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                    <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faThumbsUp} className="text-emerald-600 text-lg" />
                        <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-400">Strengths</h4>
                    </div>
                    <ul
                        className="list-disc pl-4 space-y-1.5 text-base text-emerald-700 dark:text-emerald-300/80 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: strengths }}
                    />
                </div>
            )}

            {/* Weaknesses + Radar Chart — side by side */}
            {(showWeakness || radarData.length >= 3) && (
                <div className="flex flex-col lg:flex-row gap-4">
                    {showWeakness && (
                        <div className="flex-1 p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                            <div className="flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faThumbsDown} className="text-red-500 text-lg" />
                                <h4 className="text-base font-bold text-red-800 dark:text-red-400">Weaknesses</h4>
                            </div>
                            <ul
                                className="list-disc pl-4 space-y-1.5 text-base text-red-700 dark:text-red-300/80 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: weakness }}
                            />
                        </div>
                    )}

                    {radarData.length >= 3 && (
                        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-neutral-800/30 rounded-xl p-4 min-h-[280px]">
                            <ResponsiveContainer width="100%" height={280}>
                                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                                    <PolarGrid stroke="#CEDBEA" strokeDasharray="2 2" />
                                    <PolarAngleAxis dataKey="criteriaName" tick={<CustomTick />} />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 100]}
                                        tick={{ fill: '#374151', fontSize: 11, fontWeight: 600 }}
                                        tickCount={6}
                                    />
                                    <Tooltip content={<CustomRadarTooltip />} />
                                    <Radar
                                        dataKey="score"
                                        stroke="#f97316"
                                        fill="#fdba74"
                                        fillOpacity={0.35}
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            {/* Evaluation Matrix */}
            {criteriaScores.length > 0 && (
                <div>
                    <h4 className="text-base font-bold text-gray-800 dark:text-neutral-200 mb-3">Evaluation Matrix</h4>
                    <div className="space-y-2">
                        {criteriaScores.map((criteria) => (
                            <CriteriaItem
                                key={criteria.id}
                                criteria={criteria}
                                isOpen={openCriteriaId === criteria.id}
                                onToggle={() => setOpenCriteriaId(openCriteriaId === criteria.id ? null : criteria.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiAnalysis;
