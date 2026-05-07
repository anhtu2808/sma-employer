import React, { useState } from 'react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, ResponsiveContainer, Tooltip,
} from 'recharts';
import ScoreCard from '../score-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBriefcase, faChevronDown, faCircleCheck,
    faCircleExclamation, faCircleXmark, faGear, faThumbsDown, faThumbsUp,
} from '../../../../utils/icons';
import { getCandidateLevelBadgeClasses } from '@/utils/candidateLevel';

const COMPARE_TABS = {
    OVERVIEW: 'overview',
    DETAIL: 'detail',
};

const CustomRadarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 p-3 rounded-lg shadow-lg border border-gray-100 text-sm dark:bg-neutral-800/95 dark:border-neutral-700">
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

const formatPercent = (value) => (
    typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
);

const DETAIL_STATUS_ORDER = {
    MISSING: 0,
    PARTIAL: 1,
    MATCHED: 2,
    FIXED: 3,
};

const normalizeDetailStatus = (detail) => {
    if (detail?.fixed === true || detail?.isFixed === true) {
        return 'FIXED';
    }

    const normalizedStatus = String(detail?.status || '').trim().toUpperCase();
    return DETAIL_STATUS_ORDER[normalizedStatus] != null ? normalizedStatus : 'MISSING';
};

const compareCriteriaNames = (a, b) => (
    (a?.criteriaName || '').localeCompare(b?.criteriaName || '')
);

const compareCriteriaWeights = (a, b) => {
    const leftWeight = typeof a?.scoringCriteriaWeight === 'number' ? a.scoringCriteriaWeight : null;
    const rightWeight = typeof b?.scoringCriteriaWeight === 'number' ? b.scoringCriteriaWeight : null;

    if (leftWeight != null && rightWeight != null && leftWeight !== rightWeight) {
        return rightWeight - leftWeight;
    }
    if (leftWeight != null && rightWeight == null) {
        return -1;
    }
    if (leftWeight == null && rightWeight != null) {
        return 1;
    }

    return compareCriteriaNames(a, b);
};

const compareDetailLabels = (a, b) => (
    String(a?.label || '').localeCompare(String(b?.label || ''))
);

const compareCriteriaDetails = (a, b) => {
    const statusDiff = DETAIL_STATUS_ORDER[normalizeDetailStatus(a)] - DETAIL_STATUS_ORDER[normalizeDetailStatus(b)];
    if (statusDiff !== 0) {
        return statusDiff;
    }

    return compareDetailLabels(a, b);
};

const buildRadarData = (criteriaScores) => (
    criteriaScores
        .filter((cs) => cs.criteriaName)
        .map((cs) => ({
            criteriaName: cs.criteriaName.length > 16 ? `${cs.criteriaName.substring(0, 14)}...` : cs.criteriaName,
            fullName: cs.criteriaName,
            score: typeof cs.aiScore === 'number' ? cs.aiScore : 0,
        }))
);

const AnalysisDisclaimer = () => (
    <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3 dark:border-amber-900/30 dark:bg-amber-900/10">
        <div className="mt-0.5 text-amber-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
            AI models can make mistakes. Scores and evaluations are <b>approximations</b> based on the provided data. Please verify important information manually.
        </p>
    </div>
);

const StrengthsSection = ({ strengths }) => (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
        <div className="mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faThumbsUp} className="text-lg text-emerald-600" />
            <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-400">Strengths</h4>
        </div>
        <ul
            className="list-disc space-y-1.5 pl-4 text-base leading-relaxed text-emerald-700 dark:text-emerald-300/80"
            dangerouslySetInnerHTML={{ __html: strengths }}
        />
    </div>
);

const WeaknessSection = ({ weakness }) => (
    <div className="flex-1 rounded-xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
        <div className="mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faThumbsDown} className="text-lg text-red-500" />
            <h4 className="text-base font-bold text-red-800 dark:text-red-400">Weaknesses</h4>
        </div>
        <ul
            className="list-disc space-y-1.5 pl-4 text-base leading-relaxed text-red-700 dark:text-red-300/80"
            dangerouslySetInnerHTML={{ __html: weakness }}
        />
    </div>
);

const RadarSection = ({ radarData }) => (
    <div className="flex min-h-[280px] flex-1 items-center justify-center rounded-xl bg-gray-50 p-4 dark:bg-neutral-800/30">
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
);

const EmptyCompareState = () => (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center dark:border-neutral-700 dark:bg-neutral-800/40">
        <p className="text-base font-semibold text-gray-800 dark:text-neutral-100">AI analysis is not available</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            This application does not have an AI evaluation yet.
        </p>
    </div>
);

const getDetailStatusConfig = (detail) => {
    const normalizedStatus = normalizeDetailStatus(detail);

    if (normalizedStatus === 'MATCHED') {
        return {
            icon: faCircleCheck,
            iconClassName: 'text-emerald-500',
            labelClassName: 'text-emerald-700 dark:text-emerald-400',
            descriptionClassName: 'text-emerald-700/80 dark:text-emerald-300/80',
            rowClassName: 'border-emerald-100 bg-emerald-50/60 dark:border-emerald-900/30 dark:bg-emerald-900/10',
        };
    }

    if (normalizedStatus === 'PARTIAL') {
        return {
            icon: faCircleExclamation,
            iconClassName: 'text-amber-500',
            labelClassName: 'text-amber-700 dark:text-amber-400',
            descriptionClassName: 'text-amber-700/80 dark:text-amber-300/80',
            rowClassName: 'border-amber-100 bg-amber-50/60 dark:border-amber-900/30 dark:bg-amber-900/10',
        };
    }

    if (normalizedStatus === 'FIXED') {
        return {
            icon: faGear,
            iconClassName: 'text-blue-500',
            labelClassName: 'text-blue-700 dark:text-blue-400',
            descriptionClassName: 'text-blue-700/80 dark:text-blue-300/80',
            rowClassName: 'border-blue-100 bg-blue-50/60 dark:border-blue-900/30 dark:bg-blue-900/10',
        };
    }

    return {
        icon: faCircleXmark,
        iconClassName: 'text-red-500',
        labelClassName: 'text-red-700 dark:text-red-400',
        descriptionClassName: 'text-red-700/80 dark:text-red-300/80',
        rowClassName: 'border-red-100 bg-red-50/60 dark:border-red-900/30 dark:bg-red-900/10',
    };
};

const CriteriaDetailRow = ({ detail }) => {
    const statusConfig = getDetailStatusConfig(detail);
    const displayLabel = detail?.label || detail?.description || 'Untitled detail';

    return (
        <li className={`rounded-xl border px-3 py-2.5 ${statusConfig.rowClassName}`}>
            <div className="flex items-start gap-2.5">
                <FontAwesomeIcon icon={statusConfig.icon} className={`mt-0.5 text-[15px] ${statusConfig.iconClassName}`} />
                <div className="min-w-0">
                    <p className={`text-sm font-semibold leading-snug ${statusConfig.labelClassName}`}>
                        {displayLabel}
                    </p>
                    {detail?.description && (
                        <p className={`mt-1 text-sm leading-relaxed ${statusConfig.descriptionClassName}`}>
                            {detail.description}
                        </p>
                    )}
                </div>
            </div>
        </li>
    );
};

const CriteriaItem = ({ criteria, isOpen, onToggle, showWeight = false }) => {
    const numericScore = typeof criteria.aiScore === 'number' ? criteria.aiScore : 0;
    const scoreLabel = typeof criteria.aiScore === 'number' ? Math.round(criteria.aiScore) : 'N/A';
    const barColor = numericScore >= 70 ? 'bg-emerald-500' : numericScore >= 40 ? 'bg-amber-500' : 'bg-red-500';
    const details = Array.isArray(criteria.details) ? [...criteria.details].sort(compareCriteriaDetails) : [];
    const hasDetails = details.length > 0;
    const showExplanation = !hasDetails && Boolean(criteria.aiExplanation);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800">
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/50"
            >
                <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <span className="block truncate text-base font-semibold text-gray-800 dark:text-neutral-200">
                                {criteria.criteriaName || 'Criteria'}
                            </span>
                            {showWeight && (
                                <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-neutral-400">
                                    Weight {formatPercent(criteria.scoringCriteriaWeight)}
                                </span>
                            )}
                        </div>
                        <div className="shrink-0 text-right">
                            {showWeight && (
                                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-neutral-400">
                                    Score
                                </span>
                            )}
                            <span className={`text-base font-bold ${numericScore >= 70 ? 'text-emerald-600' : numericScore >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                {scoreLabel}
                            </span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${numericScore}%` }} />
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
                <div className="space-y-3 border-t border-gray-50 px-4 pb-4 pt-1 dark:border-neutral-800">
                    {hasDetails && (
                        <ul className="space-y-2">
                            {details.map((detail, index) => (
                                <CriteriaDetailRow
                                    key={detail.id ?? `${criteria.id ?? criteria.criteriaName ?? 'criteria'}-detail-${index}`}
                                    detail={detail}
                                />
                            ))}
                        </ul>
                    )}
                    {showExplanation && (
                        <p className="text-base leading-relaxed text-gray-700 dark:text-neutral-300">
                            {criteria.aiExplanation}
                        </p>
                    )}
                    {!hasDetails && !showExplanation && (
                        <p className="text-sm leading-relaxed text-gray-500 dark:text-neutral-400">
                            No criteria detail available for this score.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const OverviewContent = ({
    aiOverallScore,
    matchLevel,
    summary,
    strengths,
    weakness,
    candidateLevel,
    radarData,
    hideOverviewSections,
}) => {
    const showSummary = !hideOverviewSections && Boolean(summary);
    const showCandidateLevel = !hideOverviewSections && Boolean(candidateLevel);
    const showStrengths = !hideOverviewSections && Boolean(strengths);
    const showWeakness = !hideOverviewSections && Boolean(weakness);
    const showHeaderContent = showSummary || showCandidateLevel;

    return (
        <div className="space-y-5">
            <div className={`items-start gap-5 ${showHeaderContent ? 'flex' : 'inline-flex'}`}>
                <ScoreCard score={aiOverallScore} size={88} matchLevel={matchLevel} />
                {showHeaderContent && (
                    <div className="min-w-0 flex-1 pt-1">
                        {showSummary && (
                            <ul
                                className="mt-0.5 list-disc space-y-1.5 pl-4 text-base leading-relaxed text-gray-700 dark:text-neutral-300"
                                dangerouslySetInnerHTML={{ __html: summary }}
                            />
                        )}
                        {showCandidateLevel && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${getCandidateLevelBadgeClasses(candidateLevel, 'soft')}`}>
                                    <FontAwesomeIcon icon={faBriefcase} className="text-[13px]" />
                                    {candidateLevel}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AnalysisDisclaimer />

            {showStrengths && <StrengthsSection strengths={strengths} />}

            {(showWeakness || radarData.length >= 3) && (
                <div className="flex flex-col gap-4 lg:flex-row">
                    {showWeakness && <WeaknessSection weakness={weakness} />}
                    {radarData.length >= 3 && <RadarSection radarData={radarData} />}
                </div>
            )}
        </div>
    );
};

const CriteriaList = ({ criteriaScores, openCriteriaId, setOpenCriteriaId, showWeight = false }) => (
    <div className="space-y-2">
        {criteriaScores.map((criteria, index) => {
            const criteriaKey = criteria.id ?? `${criteria.criteriaName || 'criteria'}-${index}`;

            return (
                <CriteriaItem
                    key={criteriaKey}
                    criteria={criteria}
                    isOpen={openCriteriaId === criteriaKey}
                    onToggle={() => setOpenCriteriaId(openCriteriaId === criteriaKey ? null : criteriaKey)}
                    showWeight={showWeight}
                />
            );
        })}
    </div>
);

const AiAnalysis = ({ aiEvaluation, hideOverviewSections = false, variant = 'default' }) => {
    const [openCriteriaId, setOpenCriteriaId] = useState(null);
    const [activeCompareTab, setActiveCompareTab] = useState(COMPARE_TABS.OVERVIEW);

    if (!aiEvaluation) {
        return variant === 'compare' ? <EmptyCompareState /> : null;
    }

    const {
        aiOverallScore,
        matchLevel,
        summary,
        strengths,
        weakness,
        candidateLevel,
        criteriaScores: rawCriteriaScores = [],
    } = aiEvaluation;

    const orderedCriteriaScores = [...rawCriteriaScores].sort(compareCriteriaWeights);
    const radarData = buildRadarData(orderedCriteriaScores);

    if (variant === 'compare') {
        return (
            <div className="space-y-5">
                <div className="inline-flex rounded-full bg-gray-100 p-1 dark:bg-neutral-800">
                    {[
                        { key: COMPARE_TABS.OVERVIEW, label: 'Overview' },
                        { key: COMPARE_TABS.DETAIL, label: 'Detail' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveCompareTab(tab.key)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${activeCompareTab === tab.key
                                ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-white'
                                : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeCompareTab === COMPARE_TABS.OVERVIEW ? (
                    <OverviewContent
                        aiOverallScore={aiOverallScore}
                        matchLevel={matchLevel}
                        summary={summary}
                        strengths={strengths}
                        weakness={weakness}
                        candidateLevel={candidateLevel}
                        radarData={radarData}
                        hideOverviewSections={hideOverviewSections}
                    />
                ) : (
                    orderedCriteriaScores.length > 0 ? (
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-base font-bold text-gray-800 dark:text-neutral-200">Criteria Breakdown</h4>
                                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                                    Ranked by scoring weight from highest to lowest.
                                </p>
                            </div>
                            <CriteriaList
                                criteriaScores={orderedCriteriaScores}
                                openCriteriaId={openCriteriaId}
                                setOpenCriteriaId={setOpenCriteriaId}
                                showWeight
                            />
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center dark:border-neutral-700 dark:bg-neutral-800/40">
                            <p className="text-base font-semibold text-gray-800 dark:text-neutral-100">No criteria breakdown available</p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                                Criteria-level AI analysis has not been generated for this application.
                            </p>
                        </div>
                    )
                )}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <OverviewContent
                aiOverallScore={aiOverallScore}
                matchLevel={matchLevel}
                summary={summary}
                strengths={strengths}
                weakness={weakness}
                candidateLevel={candidateLevel}
                radarData={radarData}
                hideOverviewSections={hideOverviewSections}
            />

            {orderedCriteriaScores.length > 0 && (
                <div>
                    <h4 className="mb-3 text-base font-bold text-gray-800 dark:text-neutral-200">Evaluation Matrix</h4>
                    <CriteriaList
                        criteriaScores={orderedCriteriaScores}
                        openCriteriaId={openCriteriaId}
                        setOpenCriteriaId={setOpenCriteriaId}
                    />
                </div>
            )}
        </div>
    );
};

export default AiAnalysis;
