import React, { useEffect, useState } from 'react';
import { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation, useUploadFileMutation } from '@/apis/apis';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { message } from 'antd';
import Form from '@/components/Form';
import Loading from '@/components/Loading';
import GeneralInfo from './components/GeneralInfo';
import Classification from './components/Classification';
import ContactInfo from './components/ContactInfo';
import Location from './components/Location';
import LegalInfo from './components/LegalInfo';
import CompanyImages from './components/CompanyImages';

const CompanyProfile = () => {
    const { data: companyData, isLoading, refetch } = useGetCompanyProfileQuery();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyProfileMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (companyData && companyData.data) {
            const data = companyData.data;
            form.setFieldsValue({
                ...data,
                companyIndustry: data.companyIndustry || data.companyindustry,
            });
        }
    }, [companyData, form]);

    const onFinish = async (values) => {
        try {
            const { taxIdentificationNumber, erc, email, link, images, companyIndustry, locations, ...rest } = values;
            const updateData = {
                ...rest,
                minSize: rest.minSize ? Number(rest.minSize) : 0,
                maxSize: rest.maxSize ? Number(rest.maxSize) : 0,
                companyindustry: companyIndustry,
                taxIdentificationNumber: taxIdentificationNumber !== undefined ? taxIdentificationNumber : companyData.data?.taxIdentificationNumber,
                erc: erc !== undefined ? erc : companyData.data?.erc,
                companyEmail: email,
                companyLink: link,
                locations: (locations || []).map((loc, index) => {
                    const originalLoc = (companyData.data?.locations || [])[index] || {};
                    const result = {
                        ...originalLoc,
                        ...loc,
                    };
                    const finalId = loc.id || originalLoc.id;
                    if (finalId) result.id = finalId;
                    else delete result.id;
                    return result;
                }),
                images: (images || []).map((img) => {
                    const result = {
                        url: img.url,
                        description: img.description || '',
                    };
                    if (img.id) result.id = img.id;
                    return result;
                }),
            };
            await updateCompany({ id: companyData.data.id, data: updateData }).unwrap();
            message.success('Company profile updated successfully');
            setIsEditing(false);
            refetch();
        } catch (error) {
            message.error('Failed to update company profile');
            console.error('Update failed:', error);
        }
    };

    const handleCancel = () => {
        if (companyData?.data) {
            form.setFieldsValue(companyData.data);
        }
        setIsEditing(false);
    };

    if (isLoading) return <Loading className="py-16" />;

    return (
        <div className="space-y-4">

            <Card className="p-6">
                <Form form={form} onFinish={onFinish} className="space-y-6" disabled={!isEditing}>
                    <GeneralInfo />
                    <Classification />
                    <ContactInfo />
                    <Location form={form} isEditing={isEditing} />
                    <LegalInfo />
                    <CompanyImages form={form} isEditing={isEditing} />

                    <div className="flex justify-start gap-3 pt-4">
                        {isEditing ? (
                            <>
                                <Button
                                    mode="primary"
                                    type="submit"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button
                                    mode="ghost"
                                    onClick={handleCancel}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                mode="primary"
                                onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                                iconLeft={<span className="material-icons-round text-sm">edit</span>}
                            >
                                Edit Information
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default CompanyProfile;
