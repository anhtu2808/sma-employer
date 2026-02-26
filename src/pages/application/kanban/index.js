import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Mail, Calendar, MapPin, Brain, Paperclip } from 'lucide-react';
import moment from 'moment';
import { getApplicationStatusConfig } from '@/constrant/application';

const KanbanBoard = ({
    statusColumns,
    getCandidatesByStatus,
    onDragEnd,
}) => {

    const getAIMatchTag = (score) => {
        if (!score) return { label: 'N/A', bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-500 dark:text-gray-400' };
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
        <DragDropContext onDragEnd={onDragEnd}>
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
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                                        >
                                            {candidates.map((app, index) => {
                                                const isTerminal = app.status === 'NOT_SUITABLE' || app.status === 'AUTO_REJECTED';
                                                const matchTag = getAIMatchTag(app.aiScore);

                                                return (
                                                    <Draggable
                                                        key={app.applicationId.toString()}
                                                        draggableId={app.applicationId.toString()}
                                                        index={index}
                                                        isDragDisabled={isTerminal}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{ ...provided.draggableProps.style }}
                                                                className={`${snapshot.isDragging ? 'z-50 shadow-2xl scale-[1.02]' : ''} ${isTerminal ? 'opacity-60' : ''}`}
                                                            >
                                                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
                                                                    {/* Top Row: AI Match Tag + Status */}
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${matchTag.bg} ${matchTag.text}`}>
                                                                            {matchTag.label}
                                                                        </span>
                                                                        {app.aiScore != null && (
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded flex items-center gap-1">
                                                                                <Brain size={10} />
                                                                                {app.aiScore}%
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Candidate Name */}
                                                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors truncate">
                                                                        {app.candidateName}
                                                                    </h4>

                                                                    {/* Email */}
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5 truncate">
                                                                        <Mail size={12} className="flex-shrink-0" />
                                                                        <span className="truncate">{app.candidateEmail || 'N/A'}</span>
                                                                    </p>

                                                                    {/* Footer */}
                                                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                                            <Calendar size={12} />
                                                                            <span>{app.appliedAt ? moment(app.appliedAt).format('MMM DD') : 'N/A'}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 text-xs">
                                                                            {app.location && (
                                                                                <span className="flex items-center gap-1 truncate max-w-[100px]">
                                                                                    <MapPin size={12} className="flex-shrink-0" />
                                                                                    <span className="truncate">{app.location}</span>
                                                                                </span>
                                                                            )}
                                                                            {app.resumeUrl && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <Paperclip size={12} />
                                                                                    CV
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
                                    )}
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