import React, { useState, useMemo, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Modal as AntModal } from 'antd';
import { usePageHeader } from '@/hooks/usePageHeader';
import toastMessage from '@/utils/toastMessage';
import { useCreateTalentPoolMutation } from '@/apis/talentPoolApi';
import TalentPoolHeader from './header';
import PoolColumn from './pool-column';
import AddCandidateModal from './add-candidate-modal';
import CreatePoolModal from './create-pool-modal';
import { MOCK_CANDIDATES, INITIAL_POOLS, POOL_COLORS } from './mockData';

const TalentPool = () => {
    usePageHeader('Talent Pool', 'Organize and manage your potential candidates');

    const [pools, setPools] = useState(INITIAL_POOLS);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobFilter, setJobFilter] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addModalPoolId, setAddModalPoolId] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [createTalentPool, { isLoading: isCreating }] = useCreateTalentPoolMutation();

    // Build candidate lookup map
    const candidateMap = useMemo(() => {
        const map = {};
        MOCK_CANDIDATES.forEach((c) => {
            map[c.applicationId] = c;
        });
        return map;
    }, []);

    // Collect all candidate IDs across all pools (for add-modal exclusion)
    const allPoolCandidateIds = useMemo(() => {
        const ids = [];
        pools.forEach((p) => ids.push(...p.candidateIds));
        return ids;
    }, [pools]);

    // Total candidates count
    const totalCandidates = allPoolCandidateIds.length;

    // Get candidates for a pool, applying search + job filters
    const getCandidatesForPool = useCallback(
        (pool) => {
            let candidates = pool.candidateIds
                .map((id) => candidateMap[id])
                .filter(Boolean);

            if (jobFilter) {
                candidates = candidates.filter((c) => c.jobId === jobFilter);
            }

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                candidates = candidates.filter(
                    (c) =>
                        c.candidateName.toLowerCase().includes(term) ||
                        c.candidateEmail.toLowerCase().includes(term) ||
                        (c.jobTitle && c.jobTitle.toLowerCase().includes(term))
                );
            }

            return candidates;
        },
        [candidateMap, searchTerm, jobFilter]
    );

    // --- Pool CRUD ---
    const handleCreatePool = () => {
        setCreateModalOpen(true);
    };

    const handleConfirmCreatePool = async (name, color) => {
        try {
            const result = await createTalentPool({ name, color }).unwrap();
            const newPool = {
                id: result?.id || result?._id || `pool_${Date.now()}`,
                name: result?.name || name,
                color: result?.color || color,
                candidateIds: [],
            };
            setPools((prev) => [...prev, newPool]);
            toastMessage.success('Pool created successfully');
            setCreateModalOpen(false);
        } catch (error) {
            console.error('Failed to create pool:', error);
            toastMessage.error(error?.data?.message || 'Failed to create pool');
        }
    };

    const handleRenamePool = (poolId, newName) => {
        setPools((prev) =>
            prev.map((p) => (p.id === poolId ? { ...p, name: newName } : p))
        );
    };

    const handleDeletePool = (poolId) => {
        const pool = pools.find((p) => p.id === poolId);
        if (!pool) return;

        AntModal.confirm({
            title: 'Delete Pool',
            content: `Are you sure you want to delete "${pool.name}"? ${pool.candidateIds.length > 0
                ? `${pool.candidateIds.length} candidate(s) will be removed from this pool.`
                : ''
                }`,
            okText: 'Delete',
            okButtonProps: { danger: true },
            cancelText: 'Cancel',
            centered: true,
            onOk: () => {
                setPools((prev) => prev.filter((p) => p.id !== poolId));
                toastMessage.success(`Pool "${pool.name}" deleted`);
            },
        });
    };

    const handleChangeColor = (poolId, color) => {
        setPools((prev) =>
            prev.map((p) => (p.id === poolId ? { ...p, color } : p))
        );
    };

    // --- Candidate operations ---
    const handleRemoveCandidate = (poolId, candidateId) => {
        setPools((prev) =>
            prev.map((p) =>
                p.id === poolId
                    ? { ...p, candidateIds: p.candidateIds.filter((id) => id !== candidateId) }
                    : p
            )
        );
        toastMessage.success('Candidate removed from pool');
    };

    const handleOpenAddModal = (poolId) => {
        setAddModalPoolId(poolId);
        setAddModalOpen(true);
    };

    const handleAddCandidates = (candidateIds) => {
        if (!addModalPoolId || candidateIds.length === 0) return;

        setPools((prev) =>
            prev.map((p) =>
                p.id === addModalPoolId
                    ? { ...p, candidateIds: [...p.candidateIds, ...candidateIds] }
                    : p
            )
        );
        setAddModalOpen(false);
        setAddModalPoolId(null);
        toastMessage.success(`${candidateIds.length} candidate(s) added to pool`);
    };

    // --- Drag & Drop ---
    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const candidateId = parseInt(draggableId, 10);

        setPools((prev) => {
            const newPools = prev.map((p) => ({ ...p, candidateIds: [...p.candidateIds] }));

            // Remove from source
            const sourcePool = newPools.find((p) => p.id === source.droppableId);
            if (sourcePool) {
                sourcePool.candidateIds = sourcePool.candidateIds.filter((id) => id !== candidateId);
            }

            // Add to destination
            const destPool = newPools.find((p) => p.id === destination.droppableId);
            if (destPool) {
                destPool.candidateIds.splice(destination.index, 0, candidateId);
            }

            return newPools;
        });
    };

    return (
        <div className="h-full flex flex-col space-y-3 animate-fadeIn font-body">
            <TalentPoolHeader
                poolCount={pools.length}
                totalCandidates={totalCandidates}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onCreatePool={handleCreatePool}
                jobFilter={jobFilter}
                setJobFilter={setJobFilter}
            />

            {/* Pool Rows */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="space-y-4 pb-4">
                        {pools.map((pool) => (
                            <PoolColumn
                                key={pool.id}
                                pool={pool}
                                candidates={getCandidatesForPool(pool)}
                                onRename={handleRenamePool}
                                onDelete={handleDeletePool}
                                onChangeColor={handleChangeColor}
                                onRemoveCandidate={handleRemoveCandidate}
                                onAddCandidate={handleOpenAddModal}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>

            {/* Add Candidate Modal */}
            <AddCandidateModal
                open={addModalOpen}
                onCancel={() => {
                    setAddModalOpen(false);
                    setAddModalPoolId(null);
                }}
                onSubmit={handleAddCandidates}
                existingIds={allPoolCandidateIds}
            />

            {/* Create Pool Modal */}
            <CreatePoolModal
                open={createModalOpen}
                onCancel={() => setCreateModalOpen(false)}
                onCreate={handleConfirmCreatePool}
                isCreating={isCreating}
            />
        </div>
    );
};

export default TalentPool;
