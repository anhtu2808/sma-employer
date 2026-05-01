import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Mail, Calendar, Phone, Briefcase, Brain, FolderPlus } from 'lucide-react';
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
    onDropToPool,
}) => {
    const navigate = useNavigate();
    const [draggingColumn, setDraggingColumn] = useState(null);
    const [draggingItem, setDraggingItem] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggingAppId, setDraggingAppId] = useState(null);
    const [isHoveringPool, setIsHoveringPool] = useState(false);

    // Track mouse position during drag
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            // Check if hovering over the pool drop zone
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (el) {
                const poolZone = el.closest('[data-pool-dropzone]');
                setIsHoveringPool(!!poolZone);
            } else {
                setIsHoveringPool(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isDragging]);

    const isValidDrop = (sourceId, targetId) => {
        if (!draggingColumn) return true;
        if (sourceId === targetId) return true;
        if (sourceId === 'APPLIED') {
            return ['VIEWED'].includes(targetId);
        }
        if (sourceId === 'VIEWED') {
            return ['SHORTLISTED', 'APPROVED', 'REJECTED'].includes(targetId);
        }
        if (sourceId === 'SHORTLISTED') {
            return ['REJECTED', 'APPROVED'].includes(targetId);
        }
        if (sourceId === 'REJECTED') {
            if (targetId === 'APPROVED') {
                return draggingItem?.isRejectedByAi === true;
            }
            return false;
        }
        if (sourceId === 'APPROVED') {
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
        const colorMap = {
            '#FF6B35': { bar: 'bg-orange-400', track: 'bg-orange-200 dark:bg-orange-900/40' },
            '#6366F1': { bar: 'bg-indigo-400', track: 'bg-indigo-200 dark:bg-indigo-900/40' },
            '#10B981': { bar: 'bg-emerald-400', track: 'bg-emerald-200 dark:bg-emerald-900/40' },
            '#EF4444': { bar: 'bg-red-400', track: 'bg-red-200 dark:bg-red-900/40' },
            '#9CA3AF': { bar: 'bg-gray-400', track: 'bg-gray-200 dark:bg-gray-700' },
        };
        return colorMap[color] || { bar: 'bg-gray-400', track: 'bg-gray-200 dark:bg-gray-700' };
    };

    const handleDragStart = useCallback((start) => {
        setDraggingColumn(start.source.droppableId);
        setIsDragging(true);
        setDraggingAppId(start.draggableId);

        const sourceColumn = start.source.droppableId;
        const candidates = getCandidatesByStatus(sourceColumn);
        const draggedApp = candidates.find(app => app.applicationId.toString() === start.draggableId);
        setDraggingItem(draggedApp || null);
    }, [getCandidatesByStatus]);

    const handleDragEnd = useCallback((result) => {
        const currentDraggingItem = draggingItem;
        const currentAppId = draggingAppId;

        // Check if pointer is over the pool drop zone
        const { x, y } = mousePos.current;
        const el = document.elementFromPoint(x, y);
        const poolZone = el?.closest?.('[data-pool-dropzone]');

        // Reset drag state
        setDraggingColumn(null);
        setDraggingItem(null);
        setIsDragging(false);
        setDraggingAppId(null);
        setIsHoveringPool(false);

        // If dropped on the pool zone, open the pool selection modal
        if (poolZone && currentAppId && onDropToPool) {
            onDropToPool(currentAppId);
            return;
        }

        // Block REJECTED → APPROVED if not AI-rejected
        if (
            result.source?.droppableId === 'REJECTED' &&
            result.destination?.droppableId === 'APPROVED' &&
            currentDraggingItem?.isRejectedByAi !== true
        ) {
            return;
        }

        onDragEnd(result);
    }, [draggingItem, draggingAppId, onDragEnd, onDropToPool]);

    return (
        <div className="h-full flex flex-col relative">
            <DragDropContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 min-h-0 overflow-x-auto pb-4 custom-scrollbar">
                    <div
                        className="flex gap-6 h-full min-w-max px-1 pt-1"
                        style={{ paddingBottom: isDragging ? 80 : 0, transition: 'padding-bottom 0.3s ease' }}
                    >
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
                                                        const isNotDraggable = (app.status === 'REJECTED' && app.isRejectedByAi !== true);
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
                                                                                            <Brain size={10} />
                                                                                            {app.evaluation.candidateLevel}
                                                                                        </span>
                                                                                    )}
                                                                                    {app.isRejectedByAi && (
                                                                                        <span className="text-[10px] font-bold tracking-wide text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded flex items-center gap-1 border border-red-100 dark:border-red-800">
                                                                                            <Brain size={10} />
                                                                                            AI REJECTED
                                                                                        </span>
                                                                                    )}
                                                                                    {app.poolInfo && (
                                                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider border whitespace-nowrap" style={{ backgroundColor: `${app.poolInfo.color}15`, color: app.poolInfo.color, borderColor: `${app.poolInfo.color}30` }}>
                                                                                            <FolderPlus size={10} />
                                                                                            {app.poolInfo.name}
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

            {/* Talent Pool Drop Zone — single zone, no pool list */}
            <div
                data-pool-dropzone="true"
                className={`absolute bottom-0 left-0 right-0 z-[60] transition-all duration-300 ease-out ${isDragging
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-full pointer-events-none'
                    }`}
            >
                <div
                    className={`mx-3 mb-3 flex items-center justify-center gap-3 py-5 rounded-2xl border-2 border-dashed transition-all duration-200 ${isHoveringPool
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 shadow-2xl shadow-orange-500/15 scale-[1.01]'
                        : 'border-orange-300 dark:border-orange-700 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-xl'
                        }`}
                >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${isHoveringPool
                        ? 'bg-orange-500 text-white scale-110'
                        : 'bg-orange-100 dark:bg-orange-900/40 text-orange-500'
                        }`}>
                        <FolderPlus size={20} />
                    </div>
                    <div>
                        <p className={`text-sm font-semibold transition-colors duration-200 ${isHoveringPool
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-700 dark:text-gray-200'
                            }`}>
                            {isHoveringPool ? 'Release to add to Talent Pool' : 'Drop here to add to Talent Pool'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Save this candidate for future opportunities
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;