import React, { useState } from 'react';
import { Form, Select, Input, Switch, Divider, message } from 'antd';
import Button from '@/components/Button';
import { 
  useGetBenefitQuery, 
  useCreateBenefitMutation, 
  useUpdateBenefitMutation, 
  useDeleteBenefitMutation 
} from '@/apis/masterDataApi';

const BENEFIT_TYPES = [
  'FINANCIAL', 'INSURANCE', 'TIME_OFF', 'FLEXIBILITY', 
  'DEVELOPMENT', 'LEISURE', 'EQUIPMENT', 'AMENITIES', 
  'WORK_ENVIRONMENT', 'OTHER'
];

const BenefitsManager = () => {
    const { data: benefitsData, isLoading: isBenefitsLoading, isError } = useGetBenefitQuery();
    const [createBenefit, { isLoading: isCreating }] = useCreateBenefitMutation();
    const [updateBenefit, { isLoading: isUpdating }] = useUpdateBenefitMutation();
    const [deleteBenefit] = useDeleteBenefitMutation();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showAvailableBenefits, setShowAvailableBenefits] = useState(false);
    
    // Create state
    const [newType, setNewType] = useState('FINANCIAL');
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    // Edit state
    const [editingBenefit, setEditingBenefit] = useState(null);
    const [editType, setEditType] = useState('');
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const rawBenefits = benefitsData || [];
    const benefitsList = Array.isArray(rawBenefits) ? rawBenefits : [];
    const benefitOptions = benefitsList.map(b => ({
        value: b.id,
        label: `[${b.type.replace('_', ' ')}] ${b.name}`,
    }));

    const handleCreateBenefit = async () => {
        if (!newName.trim() || !newType) {
            message.warning('Please select a type and enter a name');
            return;
        }
        try {
            await createBenefit({
                type: newType,
                name: newName.trim(),
                description: newDescription.trim() || undefined,
            }).unwrap();
            message.success('Benefit created successfully!');
            setNewName('');
            setNewDescription('');
            setNewType('FINANCIAL');
            setShowCreateForm(false);
        } catch (error) {
            message.error(error?.data?.message || 'Failed to create benefit');
        }
    };

    const handleStartEdit = (b) => {
        setEditingBenefit(b);
        setEditType(b.type || 'FINANCIAL');
        setEditName(b.name || '');
        setEditDescription(b.description || '');
    };

    const handleCancelEdit = () => {
        setEditingBenefit(null);
        setEditType('');
        setEditName('');
        setEditDescription('');
    };

    const handleUpdateBenefit = async () => {
        if (!editName.trim() || !editType) {
            message.warning('Please select a type and enter a name');
            return;
        }
        try {
            await updateBenefit({
                id: editingBenefit.id,
                type: editType,
                name: editName.trim(),
                description: editDescription.trim() || undefined,
            }).unwrap();
            message.success('Benefit updated successfully!');
            handleCancelEdit();
        } catch (error) {
            message.error(error?.data?.message || 'Failed to update benefit');
        }
    };

    const handleDeleteBenefit = async (id) => {
        try {
            await deleteBenefit(id).unwrap();
            message.success('Benefit deleted successfully!');
        } catch (error) {
            message.error(error?.data?.message || 'Failed to delete benefit');
        }
    };

    return (
        <div className="mt-4 space-y-4">
            <Form.Item name="benefitIds" label="Benefits" className="mb-0">
                <Select
                    mode="multiple"
                    placeholder="Select benefits..."
                    className="w-full"
                    loading={isBenefitsLoading}
                    options={benefitOptions}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent={isBenefitsLoading ? 'Loading...' : isError ? 'Could not load benefits.' : 'No benefits available'}
                />
            </Form.Item>

            {benefitsList.length > 0 && (
                <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-3">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Benefits</p>
                        <Switch
                            size="small"
                            checked={showAvailableBenefits}
                            onChange={setShowAvailableBenefits}
                        />
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {showAvailableBenefits ? 'Hide' : 'Show'} ({benefitsList.length})
                        </span>
                    </div>

                    <div style={{
                        maxHeight: showAvailableBenefits ? '2000px' : '0px',
                        overflow: 'hidden',
                        transition: 'max-height 0.35s ease-in-out',
                    }}>
                        <div className="space-y-2">
                            {benefitsList.map(b => (
                                <div key={b.id}>
                                    {editingBenefit?.id === b.id ? (
                                        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Edit Benefit</h4>
                                                <button type="button" onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                    <span className="material-icons-outlined text-lg">close</span>
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Type <span className="text-red-500">*</span>
                                                    </label>
                                                    <Select value={editType} onChange={setEditType} className="w-full">
                                                        {BENEFIT_TYPES.map(type => (
                                                            <Select.Option key={type} value={type}>
                                                                {type.replace('_', ' ')}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                                <Input.TextArea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} />
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <div className="flex gap-2">
                                                    <Button mode="default" size="sm" shape="round" onClick={handleCancelEdit}>Cancel</Button>
                                                    <Button mode="primary" size="sm" shape="round" loading={isUpdating} onClick={handleUpdateBenefit}>Save</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                            <div className="flex-1 min-w-0 mr-3">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                                                        {b.type.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{b.name}</span>
                                                </div>
                                                {b.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{b.description}</p>}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleStartEdit(b)}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-all"
                                                    title="Edit benefit"
                                                >
                                                    <span className="material-icons-outlined text-base">edit</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this benefit?')) {
                                                            handleDeleteBenefit(b.id);
                                                        }
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                                                    title="Delete benefit"
                                                >
                                                    <span className="material-icons-outlined text-base">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Divider className="!my-3">
                <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
            </Divider>

            {!showCreateForm ? (
                <button
                    type="button"
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer"
                >
                    <span className="material-icons-outlined text-lg">add_circle_outline</span>
                    Create a new benefit
                </button>
            ) : (
                <div className="p-4 rounded-xl border border-primary/20 bg-orange-50/30 dark:bg-primary/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">New Benefit</h4>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCreateForm(false);
                                setNewType('FINANCIAL');
                                setNewName('');
                                setNewDescription('');
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <span className="material-icons-outlined text-lg">close</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type <span className="text-red-500">*</span>
                            </label>
                            <Select value={newType} onChange={setNewType} className="w-full">
                                {BENEFIT_TYPES.map(type => (
                                    <Select.Option key={type} value={type}>
                                        {type.replace('_', ' ')}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="e.g. Health Insurance"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <Input.TextArea
                            placeholder="Optional description for this benefit..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={2}
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <Button
                            mode="primary"
                            size="sm"
                            shape="round"
                            loading={isCreating}
                            onClick={handleCreateBenefit}
                        >
                            Create Benefit
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BenefitsManager;
