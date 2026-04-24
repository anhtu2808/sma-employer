import React from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/components/Modal';

const PoolSelectorModal = ({
    open,
    onCancel,
    pools = [],
    currentPoolInfo = null,
    onSelectPool,
    onOpenCreatePool,
    isSubmitting = false,
}) => {
    const isMoveMode = Boolean(currentPoolInfo?.poolItemId);

    return (
        <Modal
            open={open}
            title={isMoveMode ? 'Move Candidate to Talent Pool' : 'Add to Talent Pool'}
            onCancel={onCancel}
            submitText="null"
            footer={null}
            width={420}
        >
            <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar pr-2 pb-2">
                {currentPoolInfo && (
                    <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">Current Pool</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span
                                className="h-3 w-3 rounded-full ring-2 ring-white shadow-sm"
                                style={{ backgroundColor: currentPoolInfo.color || '#ccc' }}
                            />
                            <span className="text-sm font-semibold text-neutral-800">{currentPoolInfo.name}</span>
                        </div>
                    </div>
                )}

                {pools.length === 0 ? (
                    <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-3">
                        <p className="text-gray-500 text-sm">No talent pools found.</p>
                    </div>
                ) : (
                    pools.map((pool) => {
                        const isCurrentPool = currentPoolInfo?.id === pool.id;

                        return (
                            <button
                                key={pool.id}
                                onClick={() => onSelectPool(pool.id)}
                                disabled={isSubmitting || isCurrentPool}
                                className="w-full text-left px-4 py-3 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-neutral-900 shadow-sm" style={{ backgroundColor: pool.color || '#ccc' }} />
                                    <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                        {pool.name}
                                    </span>
                                </div>
                                {isCurrentPool && (
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                        Current
                                    </span>
                                )}
                            </button>
                        );
                    })
                )}

                <button
                    onClick={onOpenCreatePool}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-neutral-900 border border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-500 hover:text-orange-600 rounded-xl transition-all"
                >
                    <Plus size={16} />
                    <span className="text-sm font-medium">Create new pool</span>
                </button>
            </div>
        </Modal>
    );
};

export default PoolSelectorModal;
