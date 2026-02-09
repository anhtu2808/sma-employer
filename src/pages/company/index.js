import React, { useState, useEffect } from 'react';
import { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation, useUploadFileMutation } from '@/apis/apis';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { message, Select } from 'antd';

const { Option } = Select;

const INDUSTRIES = [
    { value: 'INFORMATION_TECHNOLOGY', label: 'Information Technology' },
    { value: 'FINANCE', label: 'Finance' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'OTHER', label: 'Other' },
];

const COMPANY_TYPES = [
    { value: 'PRODUCT', label: 'Product' },
    { value: 'OUTSOURCING', label: 'Outsourcing' },
    { value: 'CONSULTING', label: 'Consulting' },
    { value: 'OTHER', label: 'Other' },
];

const CompanyProfile = () => {
    const { data: companyData, isLoading, refetch } = useGetCompanyProfileQuery();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyProfileMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        companyIndustry: undefined,
        companyType: undefined,
        minSize: '',
        maxSize: '',
        companyEmail: '',
        phone: '',
        address: '',
        district: '',
        city: '',
        country: '',
        taxIdentificationNumber: '',
        erc: '',
        companyLink: ''
    });

    useEffect(() => {
        if (companyData && companyData.data) {
            setFormData(companyData.data);
        }
    }, [companyData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { taxIdentificationNumber, erc, ...updateData } = formData;
            await updateCompany(updateData).unwrap();
            message.success('Company profile updated successfully');
            refetch();
        } catch (error) {
            message.error('Failed to update company profile');
            console.error('Update failed:', error);
        }
    };

    if (isLoading) return <div className="p-6">Loading...</div>;

    const selectStyle = (error) => ({
        width: '100%',
        height: '42px',
        borderRadius: '8px',
        fontFamily: 'Interdisplay, Arial, sans-serif'
    });

    return (
        <div className="p-6 space-y-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your company information</p>
            </header>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">General Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Company Name"
                                name="companyName"
                                value={formData.companyName || ''}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Website"
                                name="companyLink"
                                value={formData.companyLink || ''}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                            <div className="col-span-full">
                                <Input.TextArea
                                    label="Description"
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Introduce your company..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Classification Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Classification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-white">Industry</label>
                                <Select
                                    placeholder="Select Industry"
                                    value={formData.companyIndustry}
                                    onChange={(val) => handleSelectChange('companyIndustry', val)}
                                    style={selectStyle()}
                                >
                                    {INDUSTRIES.map(ind => (
                                        <Option key={ind.value} value={ind.value}>{ind.label}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-white">Company Type</label>
                                <Select
                                    placeholder="Select Type"
                                    value={formData.companyType}
                                    onChange={(val) => handleSelectChange('companyType', val)}
                                    style={selectStyle()}
                                >
                                    {COMPANY_TYPES.map(type => (
                                        <Option key={type.value} value={type.value}>{type.label}</Option>
                                    ))}
                                </Select>
                            </div>
                            <Input
                                label="Min Size"
                                name="minSize"
                                type="number"
                                value={formData.minSize || ''}
                                onChange={handleChange}
                            />
                            <Input
                                label="Max Size"
                                name="maxSize"
                                type="number"
                                value={formData.maxSize || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Email"
                                name="companyEmail"
                                type="email"
                                value={formData.companyEmail || ''}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Phone"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-full">
                                <Input
                                    label="Address"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    placeholder="Street address"
                                />
                            </div>
                            <Input
                                label="District"
                                name="district"
                                value={formData.district || ''}
                                onChange={handleChange}
                            />
                            <Input
                                label="City"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleChange}
                            />
                            <Input
                                label="Country"
                                name="country"
                                value={formData.country || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Legal Information Section */}
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
                                        {/* Ideally add re-upload functionality here if needed */}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic text-sm">No document uploaded</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start pt-4">
                        <Button
                            mode="primary"
                            type="submit"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update Information'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CompanyProfile;
