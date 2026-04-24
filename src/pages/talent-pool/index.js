import React, { useState, useMemo } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Modal as AntModal } from 'antd';
import { usePageHeader } from '@/hooks/usePageHeader';
import toastMessage from '@/utils/toastMessage';
import TalentPoolHeader from './header';
import PoolColumn from './pool-column';
import CreatePoolModal from './create-pool-modal';
import { useGetTalentPoolsQuery, useCreateTalentPoolMutation, useDeleteTalentPoolItemMutation, useMoveTalentPoolItemMutation, useUpdateTalentPoolMutation, useDeleteTalentPoolMutation } from '@/apis/talentPoolApi';

const TalentPool = () => {
    usePageHeader('Talent Pool', 'Organize and manage your potential candidates');

    const { data: poolsResponse } = useGetTalentPoolsQuery();
    const pools = useMemo(() => {
        const data = poolsResponse?.data || [];
        return [...data].sort((a, b) => a.id - b.id);
    }, [poolsResponse]);
    
    // Total candidates count computed from API response
    const totalCandidates = pools.reduce((acc, pool) => acc + (pool.totalItems || 0), 0);

    const [searchTerm, setSearchTerm] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editModalData, setEditModalData] = useState(null);

    const [createTalentPool, { isLoading: isCreating }] = useCreateTalentPoolMutation();
    const [updateTalentPool, { isLoading: isUpdating }] = useUpdateTalentPoolMutation();
    const [deleteTalentPool] = useDeleteTalentPoolMutation();
    const [deleteItem] = useDeleteTalentPoolItemMutation();
    const [moveItem] = useMoveTalentPoolItemMutation();

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

    const handleEditPool = (pool) => {
        setEditModalData(pool);
        setEditModalOpen(true);
    };

    const handleConfirmEditPool = async (name, color) => {
        try {
            await updateTalentPool({ id: editModalData.id, name, color }).unwrap();
            toastMessage.success('Pool updated successfully');
            setEditModalOpen(false);
            setEditModalData(null);
        } catch (error) {
            console.error('Failed to update pool:', error);
            toastMessage.error(error?.data?.message || 'Failed to update pool');
        }
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
            onOk: async () => {
                try {
                    await deleteTalentPool(poolId).unwrap();
                    toastMessage.success(`Pool "${pool.name}" deleted`);
                } catch (error) {
                    toastMessage.error(error?.data?.message || 'Failed to delete pool');
                }
            },
        });
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

    // --- Drag & Drop ---
    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        // Format: itemId_applicationId_proposedId
        const [itemId] = draggableId.split('_');

        try {
            await moveItem({ id: itemId, groupId: destination.droppableId }).unwrap();
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
                                onEdit={handleEditPool}
                                onDelete={handleDeletePool}
                                onRemoveCandidate={handleRemoveCandidate}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>

            {/* Create Pool Modal */}
            <CreatePoolModal
                open={createModalOpen}
                onCancel={() => setCreateModalOpen(false)}
                onCreate={handleConfirmCreatePool}
                isCreating={isCreating}
            />

            {/* Edit Pool Modal */}
            <CreatePoolModal
                open={editModalOpen}
                onCancel={() => {
                    setEditModalOpen(false);
                    setEditModalData(null);
                }}
                onCreate={handleConfirmEditPool}
                isCreating={isUpdating}
                initialData={editModalData}
            />
        </div>
    );
};

export default TalentPool;
