import React, { useEffect, useState } from 'react';
import { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation, useUploadFileMutation } from '@/apis/apis';
import Card from '@/components/Card';
import Button from '@/components/Button';
import toastMessage from '@/utils/toastMessage';
import Form from '@/components/Form';
import Loading from '@/components/Loading';
import GeneralInfo from './components/GeneralInfo';
import Classification from './components/Classification';
import ContactInfo from './components/ContactInfo';
import Location from './components/Location';
import LegalInfo from './components/LegalInfo';
import CompanyImages from './components/CompanyImages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCircleExclamation } from '../../utils/icons';

const CompanyProfile = () => {
    const { data: companyData, isLoading, refetch } = useGetCompanyProfileQuery();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyProfileMutation();
    const [uploadFile] = useUploadFileMutation();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (companyData && companyData.data) {
            const data = companyData.data;
            form.setFieldsValue({
                ...data,
                companyIndustry: data.companyIndustry || data.companyindustry,
                companyType: data.companyType || data.companytype,
                link: data.link || data.companyLink,
                email: data.email || data.companyEmail,
                logo: data.logo || "",
            });
        }
    }, [companyData, form]);

    const onFinish = async (values) => {
        try {
            const originalData = companyData?.data || {};
            const hasNameChange = values.name && values.name !== originalData.name;
            const hasErcChange = values.erc && values.erc !== originalData.erc;

            let newLogoUrl = "";
            if (Array.isArray(values.logo) && values.logo.length > 0) {
                newLogoUrl = values.logo[0].url || values.logo[0].thumbUrl || "";
            } else if (typeof values.logo === 'string') {
                newLogoUrl = values.logo;
            }
            const hasLogoChange = newLogoUrl !== "" && newLogoUrl !== originalData.logo;

            const isSensitiveChange = hasNameChange || hasErcChange || hasLogoChange;
            const {
                taxIdentificationNumber,
                erc,
                email,
                link,
                images,
                companyIndustry,
                companyType,
                locations,
                logo,
                ...rest
            } = values;

            let finalLogoUrl = "";
            if (Array.isArray(logo) && logo.length > 0) {
                finalLogoUrl = logo[0].url || logo[0].thumbUrl || "";
            } else if (typeof logo === 'string') {
                finalLogoUrl = logo;
            }

            const finalImages = (images || []).map((img) => ({
                ...(img.id ? { id: img.id } : {}),
                url: img.url || "",
                description: img.description || ""
            }));

            const updateData = {
                ...rest,
                name: values.name,
                logo: finalLogoUrl,
                minSize: rest.minSize ? Number(rest.minSize) : 0,
                maxSize: rest.maxSize ? Number(rest.maxSize) : 0,
                companyindustry: companyIndustry,
                companytype: companyType,
                taxIdentificationNumber: taxIdentificationNumber !== undefined ? taxIdentificationNumber : companyData.data?.taxIdentificationNumber,
                erc: erc !== undefined ? erc : companyData.data?.erc,
                companyEmail: email,
                companyLink: link,
                locations: (locations || []).map((loc, index) => {
                    const originalLoc = (companyData.data?.locations || [])[index] || {};
                    const result = { ...originalLoc, ...loc };
                    const finalId = loc.id || originalLoc.id;
                    if (finalId) result.id = finalId;
                    else delete result.id;
                    return result;
                }),
                images: finalImages,
            };


            await updateCompany({ id: companyData.data.id, data: updateData }).unwrap();

            if (isSensitiveChange) {
                toastMessage.success('Changes saved! Critical info is pending Admin approval. Your profile will reflect the updates once approved.');
            } else {
                toastMessage.success('Company profile updated successfully');
            }
            setIsEditing(false);
            refetch();
        } catch (error) {
            console.error('Update failed logic:', error);
            toastMessage.error(error?.data?.message || 'Failed to update company profile');
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
                {companyData?.data?.isUpdatePending && (
                    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3 text-orange-700 shadow-sm ">
                        <FontAwesomeIcon icon={faCircleExclamation} />
                        <span className="text-sm font-medium">
                            Some of your information (Name, Logo, or ERC) is currently under review by an administrator.
                        </span>
                    </div>
                )}
                <Form form={form} onFinish={onFinish} className="space-y-6" disabled={!isEditing}>
                    <GeneralInfo form={form} isEditing={isEditing} />
                    <Classification />
                    <ContactInfo />
                    <Location form={form} isEditing={isEditing} />
                    <LegalInfo form={form} isEditing={isEditing} />
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
                                iconLeft={<FontAwesomeIcon icon={faPenToSquare} className="text-sm" />}
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