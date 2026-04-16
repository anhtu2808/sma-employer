import React, { useState, useEffect } from 'react';
import { FolderPlus } from 'lucide-react';
import Modal from '@/components/Modal';

const CreatePoolModal = ({ open, onCancel, onCreate, isCreating, initialData = null }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#EF4444');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            if (initialData) {
                setName(initialData.name);
                setColor(initialData.color);
            } else {
                setName('');
                setColor('#EF4444');
            }
            setError('');
        }
    }, [open, initialData]);

    const handleSave = () => {
        if (!name.trim()) {
            setError('Group title is required');
            return;
        }
        onCreate(name.trim(), color);
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            title={
                <div className="flex items-center gap-2 text-gray-700">
                    <FolderPlus className="w-5 h-5" />
                    <span>{initialData ? 'Edit talent pool' : 'Create new group'}</span>
                </div>
            }
            width={500}
            submitText="Save"
            onSubmit={handleSave}
            loading={isCreating}
        >
            <div className="flex flex-col gap-6">
                {/* Name Input */}
                <div 
                    className={`relative border rounded-xl px-4 py-2 transition-colors ${
                        error ? 'border-red-500 bg-red-50/10' : 'border-gray-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10'
                    }`}
                >
                    <label 
                        className={`text-[11px] font-bold uppercase tracking-wider mb-1 block transition-colors ${
                            error ? 'text-red-500' : 'text-primary'
                        }`}
                    >
                        Group Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError('');
                        }}
                        className="w-full outline-none text-gray-900 bg-transparent text-sm font-medium"
                        placeholder="e.g. Frontend Potentials"
                        autoFocus
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-1 mb-1 font-medium">{error}</p>
                    )}
                </div>

                {/* Color Input */}
                <div className="flex items-center gap-6">
                    <label className="text-sm font-bold text-gray-900 min-w-[50px]">Color</label>
                    <div className="flex items-center gap-3 flex-1">
                        <div 
                            className="w-6 h-6 rounded-full shrink-0 shadow-sm border border-black/5 overflow-hidden relative cursor-pointer"
                            style={{ backgroundColor: color }}
                        >
                            <input 
                                type="color" 
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="absolute inset-[-5px] w-10 h-10 opacity-0 cursor-pointer"
                            />
                        </div>
                        <input
                            type="text"
                            value={color.toUpperCase()}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all max-w-[200px]"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreatePoolModal;
