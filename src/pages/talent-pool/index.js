import React, { useState, useMemo, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Modal as AntModal } from 'antd';
import { usePageHeader } from '@/hooks/usePageHeader';
import toastMessage from '@/utils/toastMessage';
import TalentPoolHeader from './header';
import PoolColumn from './pool-column';
import AddCandidateModal from './add-candidate-modal';
import CreatePoolModal from './create-pool-modal';
import { useGetTalentPoolsQuery, useCreateTalentPoolMutation, useDeleteTalentPoolItemMutation, useAddTalentPoolItemMutation } from '@/apis/talentPoolApi';

const TalentPool = () => {
    usePageHeader('Talent Pool', 'Organize and manage your potential candidates');

    const { data: poolsResponse } = useGetTalentPoolsQuery();
    const pools = poolsResponse?.data || [];
    
    // Total candidates count computed from API response
    const totalCandidates = pools.reduce((acc, pool) => acc + (pool.totalItems || 0), 0);

    const [searchTerm, setSearchTerm] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addModalPoolId, setAddModalPoolId] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [createTalentPool, { isLoading: isCreating }] = useCreateTalentPoolMutation();
    const [deleteItem] = useDeleteTalentPoolItemMutation();
    const [addItem] = useAddTalentPoolItemMutation();

    // --- Pool CRUD ---
    const handleCreatePool = () => {
        setCreateModalOpen(true);
    };

    const handleConfirmCreatePool = async (name, color) => {
        try {
            await createTalentPool({ name, color }).unwrap();
            toastMessage.success('Pool created successfully');
            setCreateModalOpen(false);
        } catch (error) {
            console.error('Failed to create pool:', error);
            toastMessage.error(error?.data?.message || 'Failed to create pool');
        }
    };

    const handleRenamePool = (poolId, newName) => {
        // TODO: Call API to rename pool when you have that endpoint
        // setPools((prev) =>
        //     prev.map((p) => (p.id === poolId ? { ...p, name: newName } : p))
        // );
    };

    const handleDeletePool = (poolId) => {
        const pool = pools.find((p) => p.id === poolId);
        if (!pool) return;

        AntModal.confirm({
            title: 'Delete Pool',
            content: `Are you sure you want to delete "${pool.name}"?`,
            okText: 'Delete',
            okButtonProps: { danger: true },
            cancelText: 'Cancel',
            centered: true,
            onOk: () => {
                // TODO: Call API to delete pool
                // setPools((prev) => prev.filter((p) => p.id !== poolId));
                toastMessage.success(`Pool "${pool.name}" deleted`);
            },
        });
    };

    const handleChangeColor = (poolId, color) => {
        // TODO: Call API to change color
        // setPools((prev) =>
        //     prev.map((p) => (p.id === poolId ? { ...p, color } : p))
        // );
    };

    // --- Candidate operations ---
    const handleRemoveCandidate = async (poolId, candidateId) => {
        try {
            await deleteItem(candidateId).unwrap();
            toastMessage.success('Candidate removed from pool');
        } catch(error) {
            toastMessage.error('Failed to remove candidate');
        }
    };

    const handleOpenAddModal = (poolId) => {
        setAddModalPoolId(poolId);
        setAddModalOpen(true);
    };

    const handleAddCandidates = async (applicationIds) => {
        if (!addModalPoolId || applicationIds.length === 0) return;

        try {
            // Need to add them one by one if not batch API
            await Promise.all(applicationIds.map(appId => addItem({ applicationId: appId, groupId: addModalPoolId }).unwrap()));
            toastMessage.success(`${applicationIds.length} candidate(s) added to pool`);
        } catch(err) {
            toastMessage.error('Failed to add candidates');
        }

        setAddModalOpen(false);
        setAddModalPoolId(null);
    };

    // --- Drag & Drop ---
    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId) return; // Ignore reordering in same list for now

        // Extract itemId and applicationId from draggableId
        const [itemId, appId] = draggableId.split('_');

        try {
            // Delete from old pool
            await deleteItem(itemId).unwrap();
            // Add to new pool
            await addItem({ applicationId: appId, groupId: destination.droppableId }).unwrap();
        } catch (error) {
            console.error("Drag and drop failed:", error);
            toastMessage.error('Failed to move candidate');
        }
    };

    return (
        <div className="h-full flex flex-col space-y-3 animate-fadeIn font-body">
            <TalentPoolHeader
                poolCount={pools.length}
                totalCandidates={totalCandidates}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onCreatePool={handleCreatePool}
            />

            {/* Pool Rows */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="space-y-4 pb-4">
                        {pools.map((pool) => (
                            <PoolColumn
                                key={pool.id}
                                pool={pool}
                                globalSearchTerm={searchTerm}
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
