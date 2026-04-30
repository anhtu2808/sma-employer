import React, { useRef } from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';
import { Image } from 'antd';
import { useUploadFileMutation } from '@/apis/apis';
import toastMessage from '@/utils/toastMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage, faCloudArrowUp, faXmark, faImage } from '../../../utils/icons';

const LegalInfo = ({ form, isEditing }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Legal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="taxIdentificationNumber" label="Tax ID">
                    <Input readOnly />
                </Form.Item>
                <Form.Item name="erc" label="ERC Document">
                    {isEditing ? (
                        <ERCUpload form={form} />
                    ) : (
                        <ErcPreview />
                    )}
                </Form.Item>
            </div>
        </div>
    );
};

const ERCUpload = ({ form, value, onChange }) => {
    const fileInputRef = useRef(null);
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
    const ercValue = Form.useWatch('erc', form) || value;

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            toastMessage.error('Please upload an image file (JPG, PNG, etc.)');
            return;
        }

        try {
            toastMessage.loading(`Uploading ${file.name}...`);
            const formData = new FormData();
            formData.append('files', file);

            const response = await uploadFile(formData).unwrap();
            const downloadUrl = response[0]?.downloadUrl || response?.downloadUrl;

            if (downloadUrl) {
                if (onChange) {
                    onChange(downloadUrl);
                } else {
                    form.setFieldsValue({ erc: downloadUrl });
                }
                toastMessage.success('Document uploaded successfully');
            } else {
                toastMessage.error('Failed to get upload URL');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            toastMessage.error('Failed to upload document');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onChange) {
            onChange("");
        } else {
            form.setFieldsValue({ erc: "" });
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {ercValue ? (
                <div className="relative group w-full h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 shadow-sm transition-all hover:shadow-md">
                    <img
                        src={ercValue}
                        alt="ERC Document"
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full text-white transition-all hover:scale-110"
                                title="Change image"
                            >
                                <FontAwesomeIcon icon={faCloudArrowUp} />
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="w-10 h-10 flex items-center justify-center bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-all hover:scale-110"
                                title="Remove image"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">Change Document</span>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary bg-gray-50/50 dark:bg-gray-800/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-primary/5 group"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
                            <span className="text-xs font-medium text-gray-500">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                <FontAwesomeIcon icon={faFileImage} className="text-primary text-2xl" />
                            </div>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Upload ERC Document</span>
                            <span className="text-[10px] text-gray-400 mt-1">JPG, PNG, WEBP allowed</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const ErcPreview = ({ value }) => {
    if (!value) {
        return <span className="text-gray-400 text-sm">No document</span>;
    }
    return (
        <Image
            src={value}
            width={80}
            height={80}
            className="rounded-lg object-contain bg-gray-50"
            style={{ borderRadius: 8, objectFit: 'contain' }}
            preview={{ mask: <span className="text-xs">Click to preview</span> }}
        />
    );
};

export default LegalInfo;
