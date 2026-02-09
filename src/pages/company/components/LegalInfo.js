import React from 'react';
import Input from '@/components/Input';

const LegalInfo = ({ formData }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Legal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Tax ID"
                    value={formData.taxIdentificationNumber || ''}
                    disabled
                />
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">ERC Document</label>
                    {formData.erc ? (
                        <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <a href={formData.erc} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-xs">
                                View Document
                            </a>
                        </div>
                    ) : (
                        <div className="text-gray-500 italic text-sm">No document uploaded</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LegalInfo;
