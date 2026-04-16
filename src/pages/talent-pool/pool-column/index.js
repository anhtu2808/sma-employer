import React, { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { MoreVertical, Edit3, Trash2, Palette, Search, UserPlus, Plus, X, Star } from 'lucide-react';
import { Dropdown, Tooltip } from 'antd';
import CandidateCard from '../candidate-card';
import { POOL_COLORS } from '../mockData';

const PoolColumn = ({
    pool,
    candidates,
    onRename,
    onDelete,
    onChangeColor,
    onRemoveCandidate,
    onAddCandidate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(pool.name);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState('');
    const inputRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    useEffect(() => {
        if (isSearchOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleRename = () => {
        const trimmed = editName.trim();
        if (trimmed && trimmed !== pool.name) {
            onRename(pool.id, trimmed);
        } else {
            setEditName(pool.name);
        }
        setIsEditing(false);
    };

    const colorSubmenu = POOL_COLORS.map((c) => ({
        key: c.value,
        label: (
            <div className="flex items-center gap-2.5">
                <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: c.value }}
                />
                <span className="text-sm">{c.name}</span>
                {pool.color === c.value && (
                    <span className="ml-auto text-primary text-xs font-bold">✓</span>
                )}
            </div>
        ),
        onClick: () => onChangeColor(pool.id, c.value),
    }));

    const menuItems = [
        {
            key: 'add',
            label: 'Add Candidate',
            icon: <UserPlus size={14} />,
            onClick: () => onAddCandidate(pool.id),
        },
        {
            key: 'rename',
            label: 'Rename',
            icon: <Edit3 size={14} />,
            onClick: () => setIsEditing(true),
        },
        {
            key: 'color',
            label: 'Change Color',
            icon: <Palette size={14} />,
            children: colorSubmenu,
        },
        { type: 'divider' },
        {
            key: 'delete',
            label: 'Delete Pool',
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: () => onDelete(pool.id),
        },
    ];

    // Filter candidates by local search
    const filteredCandidates = localSearch
        ? candidates.filter((c) => {
            const term = localSearch.toLowerCase();
            return (
                c.candidateName.toLowerCase().includes(term) ||
                c.candidateEmail.toLowerCase().includes(term) ||
                (c.jobTitle && c.jobTitle.toLowerCase().includes(term))
            );
        })
        : candidates;

    return (
        <div className="bg-white dark:bg-surface-dark border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Pool Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: pool.color }}
                    />
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename();
                                if (e.key === 'Escape') {
                                    setEditName(pool.name);
                                    setIsEditing(false);
                                }
                            }}
                            className="text-base font-bold text-gray-900 dark:text-white bg-neutral-50 dark:bg-gray-700 border border-primary/50 rounded-lg px-2.5 py-0.5 outline-none focus:ring-2 focus:ring-primary/20 min-w-[160px]"
                        />
                    ) : (
                        <h3
                            className="text-base font-bold text-gray-900 dark:text-white truncate cursor-pointer hover:text-primary transition-colors"
                            onDoubleClick={() => setIsEditing(true)}
                        >
                            {pool.name}
                        </h3>
                    )}
                    <span className="text-xs text-primary font-medium ml-1">
                        {candidates.length} <span className="text-gray-400 dark:text-gray-500 font-normal">Candidates</span>
                    </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {/* Inline Expanding Search */}
                    <div className="flex items-center">
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-[280px] opacity-100 mr-1' : 'w-0 opacity-0'
                                }`}
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder="Search by email or name of resumes"
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                    className="w-full pl-9 pr-8 py-1.5 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-neutral-400/60 dark:text-white"
                                />
                                {localSearch && (
                                    <button
                                        onClick={() => setLocalSearch('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <Tooltip title={isSearchOpen ? 'Close search' : 'Search in pool'}>
                            <button
                                onClick={() => {
                                    setIsSearchOpen(!isSearchOpen);
                                    if (isSearchOpen) setLocalSearch('');
                                }}
                                className={`p-2 rounded-lg transition-all ${isSearchOpen
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Search size={16} />
                            </button>
                        </Tooltip>
                    </div>

                    {/* More Menu */}
                    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all">
                            <MoreVertical size={16} />
                        </button>
                    </Dropdown>
                </div>
            </div>

            {/* Droppable Body */}
            <Droppable droppableId={pool.id} direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`px-5 py-4 overflow-x-auto custom-scrollbar min-h-[140px] flex gap-3 flex-nowrap rounded-b-2xl transition-colors duration-200
                            ${snapshot.isDraggingOver ? 'bg-orange-100/60 dark:bg-orange-800/40' : ''}
                        `}
                    >
                        {filteredCandidates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center w-full">
                                <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-3 border border-gray-100 dark:border-gray-700">
                                    <Star size={32} className="text-gray-200 dark:text-gray-600" />
                                </div>
                                <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">No candidates</p>
                                <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                                    No candidates found for this category.
                                </p>
                            </div>
                        ) : (
                            filteredCandidates.map((candidate, index) => (
                                <CandidateCard
                                    key={candidate.applicationId}
                                    candidate={candidate}
                                    index={index}
                                    poolColor={pool.color}
                                    onRemove={(id) => onRemoveCandidate(pool.id, id)}
                                />
                            ))
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default PoolColumn;
