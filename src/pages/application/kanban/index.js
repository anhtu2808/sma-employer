import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Space, Badge, Avatar } from 'antd';
import Card from '@/components/Card';

const KanbanBoard = ({
    statusColumns,
    getCandidatesByStatus,
    onDragEnd,
    statusAvatarStyles
}) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="h-full overflow-x-auto pb-4 custom-scrollbar rounded-b-2xl border border-t-0 border-neutral-100 dark:border-neutral-800">
                <div className="flex gap-3 h-full min-w-max">
                    {statusColumns.map((column) => (
                        <div key={column.id} className="w-80 flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30 p-4 border-r border-neutral-100 dark:border-neutral-800 last:border-r-0">
                            {/* Column Header */}
                            <div className="flex justify-between items-center mb-3 px-2">
                                <Space>
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: column.color }} />
                                    <span className="text-xs font-bold text-neutral-700 dark:text-white tracking-wide">{column.title}</span>
                                    <Badge count={getCandidatesByStatus(column.id).length} showZero color="#fb923c" className="text-[10px] font-bold" />
                                </Space>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5 rounded-xl' : ''}`}
                                    >
                                        {getCandidatesByStatus(column.id).map((app, index) => {
                                            const isTerminal = app.status === 'NOT_SUITABLE' || app.status === 'AUTO_REJECTED';

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
                                                            className={`${snapshot.isDragging ? 'z-50 shadow-2xl scale-105' : ''} ${isTerminal ? 'opacity-70' : ''}`}
                                                        >
                                                            <Card className="!p-4 hover:shadow-md transition-all border border-neutral-100 dark:border-neutral-800 rounded-2xl group cursor-grab active:cursor-grabbing relative overflow-hidden bg-white dark:bg-neutral-800">
                                                                <div className={`absolute top-0 left-0 w-1 h-full ${app.matchLevel === 'EXCELLENT' ? 'bg-green-500' : 'bg-transparent'}`} />
                                                                <div className="flex gap-4">
                                                                    <Avatar size={44} className={`${statusAvatarStyles[app.status]} font-black text-xs rounded-full shadow-sm`}>
                                                                        {app.candidateName.substring(0, 2).toUpperCase()}
                                                                    </Avatar>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-semibold text-sm truncate dark:text-white group-hover:text-primary transition-colors">
                                                                            {app.candidateName}
                                                                        </h4>
                                                                        <p className="text-xs text-neutral-500 mt-0.5">
                                                                            {app.candidateEmail || 'N/A'}
                                                                        </p>
                                                                        <div className={`mt-3 inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold tracking-wide ${app.aiScore >= 80 ? 'bg-green-50 text-green-600' : app.aiScore >= 50 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                                                                            {app.aiScore || 0}% AI Match
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card>
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
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;