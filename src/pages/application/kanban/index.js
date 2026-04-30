import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Mail, Calendar, Phone, Briefcase, Sparkles } from 'lucide-react';
import moment from 'moment';
import { getApplicationStatusConfig } from '@/constrant/application';
import { Tooltip } from 'antd';
import toastMessage from '@/utils/toastMessage';
import { useNavigate } from 'react-router-dom';
import ManualScorePopover, { getEffectiveScore, isManualScored, ManualScoreBadge } from '../ManualScorePopover';
import { ScoreBars, getScoreColor } from '../list';

const copyToClipboard = (e, value, label) => {
    e.stopPropagation();
    if (!value) return;
    navigator.clipboard.writeText(value)
        .then(() => toastMessage.success(`${label} copied!`))
        .catch(() => toastMessage.error('Copy failed'));
};

const KANBAN_LEVEL_STYLE = {
    INTERN: 'bg-slate-50 text-slate-600 border-slate-200',
    FRESHER: 'bg-sky-50 text-sky-700 border-sky-200',
    JUNIOR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MIDDLE: 'bg-amber-50 text-amber-700 border-amber-200',
    SENIOR: 'bg-violet-50 text-violet-700 border-violet-200',
    LEAD: 'bg-orange-50 text-orange-700 border-orange-200',
    MANAGER: 'bg-rose-50 text-rose-700 border-rose-200',
};

const KanbanBoard = ({
    statusColumns,
    getCandidatesByStatus,
    onDragEnd,
}) => {
    const navigate = useNavigate();
    const [draggingColumn, setDraggingColumn] = useState(null);
    const [draggingItem, setDraggingItem] = useState(null);

    const isValidDrop = (sourceId, targetId) => {
        if (!draggingColumn) return true;
        if (sourceId === targetId) return true;
        if (sourceId === 'VIEWED') {
            return ['SHORTLISTED', 'APPROVED', 'REJECTED'].includes(targetId);
        }
        if (sourceId === 'SHORTLISTED') {
            return ['REJECTED', 'APPROVED'].includes(targetId);
        }
        if (sourceId === 'REJECTED') {
            if (targetId === 'APPROVED') {
                // Only allow drag to APPROVED if the item was rejected by AI
                return draggingItem?.isRejectedByAi === true;
            }
            return false;
        }
        return false;
    };

    const getAIMatchTag = (score) => {
        if (!score) return { label: 'Not Rated', bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-500 dark:text-gray-400' };
        if (score >= 80) return { label: 'High', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' };
        if (score >= 50) return { label: 'Medium', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' };
        return { label: 'Low', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' };
    };

    const getColumnBarColor = (color) => {
        // Map hex colors to Tailwind bar classes
        const colorMap = {
            '#FF6B35': { bar: 'bg-orange-400', track: 'bg-orange-200 dark:bg-orange-900/40' },
            '#6366F1': { bar: 'bg-indigo-400', track: 'bg-indigo-200 dark:bg-indigo-900/40' },
            '#10B981': { bar: 'bg-emerald-400', track: 'bg-emerald-200 dark:bg-emerald-900/40' },
            '#EF4444': { bar: 'bg-red-400', track: 'bg-red-200 dark:bg-red-900/40' },
            '#9CA3AF': { bar: 'bg-gray-400', track: 'bg-gray-200 dark:bg-gray-700' },
        };
        return colorMap[color] || { bar: 'bg-gray-400', track: 'bg-gray-200 dark:bg-gray-700' };
    };

    return (
        <DragDropContext
            onDragStart={(start) => {
                setDraggingColumn(start.source.droppableId);
                // Find the dragging item to check isRejectedByAi
                const sourceColumn = start.source.droppableId;
                const candidates = getCandidatesByStatus(sourceColumn);
                const draggedApp = candidates.find(app => app.applicationId.toString() === start.draggableId);
                setDraggingItem(draggedApp || null);
            }}
            onDragEnd={(result) => {
                const currentDraggingItem = draggingItem;
                setDraggingColumn(null);
                setDraggingItem(null);

                // Block REJECTED → APPROVED if not AI-rejected
                if (
                    result.source?.droppableId === 'REJECTED' &&
                    result.destination?.droppableId === 'APPROVED' &&
                    currentDraggingItem?.isRejectedByAi !== true
                ) {
                    return; // silently block the drop
                }

                onDragEnd(result);
            }}
        >
            <div className="h-full overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-6 h-full min-w-max px-1 pt-1">
                    {statusColumns.map((column) => {
                        const candidates = getCandidatesByStatus(column.id);
                        const barColors = getColumnBarColor(column.color);

                        return (
                            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col h-full bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-3 border border-neutral-100/60 dark:border-neutral-800/60">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{column.title}</h3>
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-medium">
                                            {candidates.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Color Bar */}
                                <div className={`h-1 w-full ${barColors.track} rounded-full mb-4 overflow-hidden`}>
                                    <div className={`h-full ${barColors.bar} w-full rounded-full`} />
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={column.id} isDropDisabled={draggingColumn ? !isValidDrop(draggingColumn, column.id) : false}>
                                    {(provided, snapshot) => {
                                        const isColumnValidDrop = draggingColumn && isValidDrop(draggingColumn, column.id) && column.id !== draggingColumn;
                                        const isColumnInvalidDrop = draggingColumn && !isValidDrop(draggingColumn, column.id) && column.id !== draggingColumn;

                                        return (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar transition-all duration-300 rounded-xl
                                                    ${snapshot.isDraggingOver ? 'bg-primary/10 ring-2 ring-primary/30 shadow-inner' : ''}
                                                    ${isColumnValidDrop && !snapshot.isDraggingOver ? 'bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-500/30 shadow-inner' : ''}
                                                    ${isColumnInvalidDrop ? 'opacity-30 bg-gray-50/50 dark:bg-gray-800/20 grayscale pointer-events-none' : ''}
                                                `}
                                            >
                                                {candidates.map((app, index) => {
                                                    // APPLIED and APPROVED can't be dragged at all
                                                    // REJECTED cards that are NOT AI-rejected also can't be dragged (nowhere valid to go)
                                                    const isNotDraggable = app.status === 'APPLIED' || app.status === 'APPROVED'
                                                        || (app.status === 'REJECTED' && app.isRejectedByAi !== true);
                                                    const scoreValue = getEffectiveScore(app.evaluation);
                                                    const matchTag = getAIMatchTag(scoreValue);
                                                    const manualScored = isManualScored(app.evaluation);

                                                    return (
                                                        <Draggable
                                                            key={app.applicationId.toString()}
                                                            draggableId={app.applicationId.toString()}
                                                            index={index}
                                                            isDragDisabled={isNotDraggable}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{ ...provided.draggableProps.style }}
                                                                    className={`${snapshot.isDragging ? 'z-50 shadow-2xl scale-[1.02]' : ''}`}
                                                                >
                                                                    <div className={`bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow ${!isNotDraggable ? 'hover:shadow-md cursor-grab active:cursor-grabbing' : ''} group`}>
                                                                        {/* Top Row: AI Match Tag + Status */}
                                                                        <div className="flex justify-between items-start mb-3">
                                                                            <div className="flex flex-wrap gap-1.5 flex-1 pr-2">
                                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${matchTag.bg} ${matchTag.text}`}>
                                                                                    {matchTag.label}
                                                                                </span>
                                                                                {app.evaluation?.candidateLevel && (
                                                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${KANBAN_LEVEL_STYLE[app.evaluation.candidateLevel] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                                                        <Sparkles size={10} />
                                                                                        {app.evaluation.candidateLevel}
                                                                                    </span>
                                                                                )}
                                                                                {app.isRejectedByAi && (
                                                                                    <span className="text-[10px] font-bold tracking-wide text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded flex items-center gap-1 border border-red-100 dark:border-red-800">
                                                                                        <Sparkles size={10} />
                                                                                        AI REJECTED
                                                                                    </span>
                                                                                )}
                                                                            </div>

                                                                            {/* SCORE (manual prioritized) */}
                                                                            {scoreValue != null && (
                                                                                <div className="shrink-0 flex flex-col items-end gap-1">
                                                                                    <ManualScorePopover evaluation={app.evaluation} applicationId={app.applicationId} placement="bottomRight">
                                                                                        <span className={`inline-flex items-end gap-1.5 cursor-pointer ${getScoreColor(scoreValue)}`}>
                                                                                            <ScoreBars score={scoreValue} size="sm" />
                                                                                            <span className="text-sm font-bold leading-none">
                                                                                                {Math.round(scoreValue)}
                                                                                            </span>
                                                                                        </span>
                                                                                    </ManualScorePopover>
                                                                                    {manualScored && <ManualScoreBadge evaluation={app.evaluation} />}
                                                                                </div>
                                                                            )}

                                                                        </div>

                                                                        {/* Candidate Name */}
                                                                        <div className="flex justify-between items-start mb-1 gap-2">
                                                                            <h4
                                                                                className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate cursor-pointer hover:underline"
                                                                                onClick={() => navigate(`/applications/${app.applicationId}`)}
                                                                            >
                                                                                {app.candidateName}
                                                                            </h4>

                                                                            {app.totalApplicationsToCompany > 1 && (
                                                                                <Tooltip title={`Total ${app.totalApplicationsToCompany} applications to your company.`}>
                                                                                    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-800">
                                                                                        {app.totalApplicationsToCompany}
                                                                                    </span>
                                                                                </Tooltip>
                                                                            )}
                                                                        </div>

                                                                        {/* Email */}
                                                                        <p
                                                                            className={`text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5 truncate ${app.candidateEmail ? 'cursor-pointer hover:text-orange-500 transition-colors' : ''}`}
                                                                            onClick={(e) => copyToClipboard(e, app.candidateEmail, 'Email')}
                                                                            title={app.candidateEmail ? 'Click to copy email' : ''}
                                                                        >
                                                                            <Mail size={12} className="flex-shrink-0" />
                                                                            <span className="truncate">{app.candidateEmail || 'N/A'}</span>
                                                                        </p>

                                                                        {/* Footer */}
                                                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                                                                <Calendar size={12} />
                                                                                <span>{app.appliedAt ? moment(app.appliedAt).format('MMM DD') : 'N/A'}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-xs">
                                                                                {app.totalExperienceYears > 0 && (
                                                                                    <span className="flex items-center gap-1">
                                                                                        <Briefcase size={12} className="flex-shrink-0" />
                                                                                        {app.totalExperienceYears} yrs
                                                                                    </span>
                                                                                )}
                                                                                {app.candidatePhone && (
                                                                                    <span
                                                                                        className="flex items-center gap-1 truncate max-w-[120px] cursor-pointer hover:text-orange-500 transition-colors"
                                                                                        onClick={(e) => copyToClipboard(e, app.candidatePhone, 'Phone')}
                                                                                        title="Click to copy phone"
                                                                                    >
                                                                                        <Phone size={12} className="flex-shrink-0" />
                                                                                        <span className="truncate">{app.candidatePhone}</span>
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        );
                                    }}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;